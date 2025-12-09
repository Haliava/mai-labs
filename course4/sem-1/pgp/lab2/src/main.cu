#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <cuda_runtime.h>
#include <math.h>

#define BLOCK_SIZE 16
#define NUM_BLOCKS 8

#define CSC(call)  									                \
do {											                    \
	cudaError_t res = call;							                \
	if (res != cudaSuccess) {							            \
		fprintf(stderr, "ERROR in %s:%d. Message: %s\n",			\
				__FILE__, __LINE__, cudaGetErrorString(res));		\
		exit(0);								                    \
	}										                        \
} while(0)

__device__ float grayscale(uchar4 pixel) {
  return 0.299f * pixel.x + 0.587f * pixel.y + 0.114f * pixel.z;
}

__global__ void sobelKernel(cudaTextureObject_t texObj, uchar4* d_outData, int width, int height) {
  const int thread_x_idx = blockIdx.x * blockDim.x + threadIdx.x;
  const int thread_y_idx = blockIdx.y * blockDim.y + threadIdx.y;
  const int total_threads_x = gridDim.x * blockDim.x;
  const int total_threads_y = gridDim.y * blockDim.y;

  const float Gx[3][3] = {
    {-1.0f, 0.0f, 1.0f},
    {-2.0f, 0.0f, 2.0f},
    {-1.0f, 0.0f, 1.0f}
  };

  const float Gy[3][3] = {
    {-1.0f, -2.0f, -1.0f},
    { 0.0f,  0.0f,  0.0f},
    { 1.0f,  2.0f,  1.0f}
  };

  for (int x = thread_x_idx; x < width; x += total_threads_x) {
    for (int y = thread_y_idx; y < height; y += total_threads_y) {
      float sumX = 0.0f;
      float sumY = 0.0f;

      for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
          uchar4 neighborPixel = tex2D<uchar4>(texObj, (float)(x + j) + 0.5f, (float)(y + i) + 0.5f);

          float gray = grayscale(neighborPixel);
          sumX += gray * Gx[i + 1][j + 1];
          sumY += gray * Gy[i + 1][j + 1];
        }
      }

      float magnitude = sqrtf(sumX * sumX + sumY * sumY);

      int val = (int)(magnitude + 0.5f);
      if (val > 255) val = 255;
      unsigned char finalVal = (unsigned char)val;
      int idx = y * width + x;
      d_outData[idx] = make_uchar4(finalVal, finalVal, finalVal, 0);
    }
  }
}

int main(int argc, char** argv) {
  char inPath[256], outPath[256];
  scanf("%s", inPath);
  scanf("%s", outPath);

  FILE *inFile = fopen(inPath, "rb");
  if (!inFile) {
    return 1;
  }

  int w, h;
  fread(&w, sizeof(int), 1, inFile);
  fread(&h, sizeof(int), 1, inFile);
  size_t dataSize = (size_t)w * h * 4;

  if ((size_t)w * h > 100000000) {
    return 1;
  }

  unsigned char* h_inData = (unsigned char*)malloc(dataSize);
  if (!h_inData) {
    fclose(inFile);
    return 1;
  }

  fread(h_inData, 1, dataSize, inFile);
  fclose(inFile);

  cudaArray* cuArray;
  cudaChannelFormatDesc channelDesc = cudaCreateChannelDesc<uchar4>();
  CSC(cudaMallocArray(&cuArray, &channelDesc, w, h));

  size_t pitch = (size_t)w * sizeof(uchar4); 
  CSC(cudaMemcpy2DToArray(cuArray, 0, 0, h_inData, pitch, (size_t)w * sizeof(uchar4), (size_t)h, cudaMemcpyHostToDevice));

  cudaResourceDesc resDesc;
  memset(&resDesc, 0, sizeof(resDesc));
  resDesc.resType = cudaResourceTypeArray;
  resDesc.res.array.array = cuArray;

  cudaTextureDesc texDesc;
  memset(&texDesc, 0, sizeof(texDesc));
  texDesc.addressMode[0] = cudaAddressModeClamp;
  texDesc.addressMode[1] = cudaAddressModeClamp;
  texDesc.filterMode = cudaFilterModePoint;
  texDesc.readMode = cudaReadModeElementType;
  texDesc.normalizedCoords = 0;

  cudaTextureObject_t texObj = 0;
  CSC(cudaCreateTextureObject(&texObj, &resDesc, &texDesc, NULL));

  uchar4* d_outData;
  CSC(cudaMalloc((void**)&d_outData, dataSize));

  dim3 threadsPerBlock(BLOCK_SIZE, BLOCK_SIZE); 
  dim3 numBlocks(NUM_BLOCKS, NUM_BLOCKS);
  
  sobelKernel<<<numBlocks, threadsPerBlock>>>(texObj, d_outData, w, h);
  CSC(cudaGetLastError());
  CSC(cudaDeviceSynchronize());

  unsigned char* h_outData = (unsigned char*)malloc(dataSize);
  if (!h_outData) {
    return 1;
  }

  CSC(cudaMemcpy(h_outData, d_outData, dataSize, cudaMemcpyDeviceToHost));

  FILE *outFile = fopen(outPath, "wb");
  if (!outFile) {
    return 1;
  }
  fwrite(&w, sizeof(int), 1, outFile);
  fwrite(&h, sizeof(int), 1, outFile);
  fwrite(h_outData, 1, dataSize, outFile);
  fclose(outFile);

  free(h_inData);
  free(h_outData);
  cudaFree(d_outData);
  CSC(cudaDestroyTextureObject(texObj));
  cudaFreeArray(cuArray); 
  return 0;
}