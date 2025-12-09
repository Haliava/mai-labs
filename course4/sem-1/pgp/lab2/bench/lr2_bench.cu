#include <bits/stdc++.h>
#include <cuda_runtime.h>
using namespace std;

// const dim3 block_shape_2d = dim3(32, 8);
// const dim3 grid_shape_2d  = dim3(64, 64);

static uint32_t read_revers_bytes(ifstream &f) {
    uint8_t b[4];
    f.read(reinterpret_cast<char*>(b), 4);
    return (uint32_t)b[0] |
           ((uint32_t)b[1] << 8) |
           ((uint32_t)b[2] << 16) |
           ((uint32_t)b[3] << 24);
}

static void write_revers_bytes(ofstream &f, uint32_t v) {
    uint8_t b[4];
    b[0] = v & 0xFF;
    b[1] = (v>>8) & 0xFF;
    b[2] = (v>>16) & 0xFF;
    b[3] = (v>>24) & 0xFF;
    f.write((char*)b, 4);
}

#define CSC(call) do { \
    cudaError_t err = call; \
    if (err != cudaSuccess) { \
        fprintf(stderr, "CUDA error at %s:%d: %s\n", __FILE__, __LINE__, cudaGetErrorString(err)); \
        exit(1); \
    } \
} while(0)

__constant__ int Mx_dev[3][3] = {
    {-1, 0, 1},
    {-2, 0, 2},
    {-1, 0, 1}
};
__constant__ int My_dev[3][3] = {
    {-1, -2, -1},
    { 0,  0,  0},
    { 1,  2,  1}
};

__global__ void sobel_kernel(cudaTextureObject_t texY, uint8_t* d_outGray, int width, int height) {
    int x_start = blockIdx.x * blockDim.x + threadIdx.x;
    int y_start = blockIdx.y * blockDim.y + threadIdx.y;
    int xStep = blockDim.x * gridDim.x;
    int yStep = blockDim.y * gridDim.y;

    for (int y = y_start; y < height; y += yStep) {
        for (int x = x_start; x < width; x += xStep) {
            float gx = 0.0f, gy = 0.0f;

            for (int kr = -1; kr <= 1; ++kr) {
                int ip = y + kr;
                if (ip < 0) ip = 0;
                if (ip > height - 1) ip = height - 1;

                for (int kc = -1; kc <= 1; ++kc) {
                    int jp = x + kc;
                    if (jp < 0) jp = 0;
                    if (jp > width - 1) jp = width - 1;

                    // читаем из текстуры float яркость
                    float val = tex2D<float>(texY, jp, ip);

                    int kx = Mx_dev[kr + 1][kc + 1];
                    int ky = My_dev[kr + 1][kc + 1];
                    gx += kx * val;
                    gy += ky * val;
                }
            }

            float mag = sqrtf(gx * gx + gy * gy);
            if (mag > 255.0f) mag = 255.0f;
            d_outGray[(size_t)y * (size_t)width + (size_t)x] = (uint8_t)lrintf(mag);
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // Считываем пути к файлам
    string inPath, outPath;
    getline(cin, inPath);
    getline(cin, outPath);

    ifstream fin(inPath, ios::binary);
    uint32_t width = read_revers_bytes(fin);
    uint32_t height = read_revers_bytes(fin);
    size_t pixels = (size_t)width * (size_t)height;

    vector<uint8_t> pixelbuf(pixels * 4);
    fin.read((char*)pixelbuf.data(), pixelbuf.size());
    fin.close();

    // Вычисляем яркости
    vector<float> Y(pixels);
    for (size_t i = 0; i < pixels; ++i) {
        uint8_t r = pixelbuf[i*4 + 0];
        uint8_t g = pixelbuf[i*4 + 1];
        uint8_t b = pixelbuf[i*4 + 2];
        Y[i] = 0.299f * r + 0.587f * g + 0.114f * b;
    }

    vector<uint8_t> outGray(pixels);

    // Создание текстуры
    cudaArray* cuArrayY;
    cudaChannelFormatDesc channelDesc = cudaCreateChannelDesc<float>();
    CSC(cudaMallocArray(&cuArrayY, &channelDesc, width, height));
    CSC(cudaMemcpy2DToArray(cuArrayY, 0, 0, Y.data(),
                            width * sizeof(float), width * sizeof(float),
                            height, cudaMemcpyHostToDevice));

    struct cudaResourceDesc resDesc;
    memset(&resDesc, 0, sizeof(resDesc));
    resDesc.resType = cudaResourceTypeArray;
    resDesc.res.array.array = cuArrayY;

    struct cudaTextureDesc texDesc;
    memset(&texDesc, 0, sizeof(texDesc));
    texDesc.addressMode[0] = cudaAddressModeClamp;
    texDesc.addressMode[1] = cudaAddressModeClamp;
    texDesc.filterMode = cudaFilterModePoint;
    texDesc.readMode = cudaReadModeElementType;
    texDesc.normalizedCoords = false;

    cudaTextureObject_t texY = 0;
    CSC(cudaCreateTextureObject(&texY, &resDesc, &texDesc, nullptr));

    uint8_t* d_outGray = nullptr;
    CSC(cudaMalloc(&d_outGray, pixels * sizeof(uint8_t)));

    ofstream bench("bench_result.txt");
    if (!bench.is_open()) {
        cerr << "Cannot open bench_result.txt for writing\n";
        return 1;
    }

    vector<int> dims = {1, 2, 4, 8, 16, 32};

    for (int gx : dims) {
        for (int gy : dims) {
            dim3 grid(gx, gy);
            dim3 block(gx, gy);

            cudaEvent_t start, stop;
            cudaEventCreate(&start);
            cudaEventCreate(&stop);

            CSC(cudaMemset(d_outGray, 0, pixels * sizeof(uint8_t)));
            cudaEventRecord(start);

            sobel_kernel<<<grid, block>>>(texY, d_outGray, (int)width, (int)height);
            CSC(cudaGetLastError());
            CSC(cudaEventRecord(stop));
            CSC(cudaEventSynchronize(stop));

            float ms = 0.0f;
            cudaEventElapsedTime(&ms, start, stop);

            bench << "<<<dim3(" << gx << "," << gy << "), dim3(" << gx << "," << gy << ")>>> "
                  << fixed << setprecision(3) << ms << "мс\n";

            cudaEventDestroy(start);
            cudaEventDestroy(stop);
        }
    }

    bench.close();

    // Финальное копирование (для проверки результата на одной конфигурации)
    sobel_kernel<<<dim3(32,8), dim3(32,8)>>>(texY, d_outGray, (int)width, (int)height);
    CSC(cudaDeviceSynchronize());
    CSC(cudaMemcpy(outGray.data(), d_outGray, pixels * sizeof(uint8_t), cudaMemcpyDeviceToHost));

    CSC(cudaDestroyTextureObject(texY));
    CSC(cudaFreeArray(cuArrayY));
    CSC(cudaFree(d_outGray));

    ofstream fout(outPath, ios::binary);
    write_revers_bytes(fout, width);
    write_revers_bytes(fout, height);
    for (size_t i = 0; i < pixels; ++i) {
        uint8_t g = outGray[i];
        uint8_t outpix[4] = { g, g, g, 0x00 };
        fout.write((char*)outpix, 4);
    }
    fout.close();

    return 0;
}
