#include <iostream>
#include <stdlib.h>
#include <cuda_runtime.h>
#include <cmath>

#define CSC(call)  									                \
do {											                    \
	cudaError_t res = call;							                \
	if (res != cudaSuccess) {							            \
		fprintf(stderr, "ERROR in %s:%d. Message: %s\n",			\
				__FILE__, __LINE__, cudaGetErrorString(res));		\
		exit(0);								                    \
	}										                        \
} while(0)

__global__ void print_min_elements(double *a, double *b, int length) {
  int idx = blockIdx.x * blockDim.x + threadIdx.x;
  int offset = blockDim.x * gridDim.x;

  while (idx < length) {
    b[idx] = fmin(a[idx], b[idx]);
    idx += offset;
  }
}

int main() {
  int n;
  std::cin >> n;

  double *cpu_vec1, *cpu_vec2;
  cpu_vec1 = (double*)malloc(n * sizeof(double));
  cpu_vec2 = (double*)malloc(n * sizeof(double));

  for (int i = 0; i < n; i++) std::cin >> cpu_vec1[i];
  for (int i = 0; i < n; i++) std::cin >> cpu_vec2[i];

  double *gpu_vec1, *gpu_vec2;
  CSC(cudaMalloc(&gpu_vec1, n * sizeof(double)));
  CSC(cudaMalloc(&gpu_vec2, n * sizeof(double)));

  CSC(cudaMemcpy(gpu_vec1, cpu_vec1, n * sizeof(double), cudaMemcpyHostToDevice));
  CSC(cudaMemcpy(gpu_vec2, cpu_vec2, n * sizeof(double), cudaMemcpyHostToDevice));

  print_min_elements<<<1024, 1024>>>(gpu_vec1, gpu_vec2, n);
  CSC(cudaDeviceSynchronize());

  CSC(cudaMemcpy(cpu_vec2, gpu_vec2, n * sizeof(double), cudaMemcpyDeviceToHost));

  for (int i = 0; i < n; i++) {
    printf("%.10e%s", cpu_vec2[i], (i < n - 1 ? " " : ""));
  }

  CSC(cudaFree(gpu_vec1));
  CSC(cudaFree(gpu_vec2));

  free(cpu_vec1);
  free(cpu_vec2);

  return 0;
}