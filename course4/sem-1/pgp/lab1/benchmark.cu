#include <iostream>
#include <fstream>
#include <cuda_runtime.h>
#include <cmath>
#include <cstdio>
#include <random>  // <-- для генерации случайных чисел

// Макрос для проверки ошибок CUDA
#define CUDA_CHECK(call) \
    do { \
        cudaError_t err = call; \
        if (err != cudaSuccess) { \
            std::cerr << "CUDA error at " << __FILE__ << ":" << __LINE__ \
                      << " - " << cudaGetErrorString(err) << std::endl; \
            exit(1); \
        } \
    } while(0)

__global__ void print_min_elements(double *a, double *b, int length) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < length) {
        b[idx] = fmin(a[idx], b[idx]);
    }
}

void generate_random_data(const char *filename, int n, double min_val = -1000.0, double max_val = 1000.0) {
    std::ofstream f(filename);
    if (!f.is_open()) {
        std::cerr << "Cannot create file " << filename << std::endl;
        exit(1);
    }

    std::random_device rd;  // Источник энтропии (для seed)
    std::mt19937 gen(rd()); // Генератор (Mersenne Twister)
    std::uniform_real_distribution<double> dis(min_val, max_val);

    for (int i = 0; i < n; i++) {
        f << dis(gen) << "\n";
    }

    f.close();
    std::cout << "Generated " << n << " random numbers in [" << min_val << ", " << max_val << "] to " << filename << std::endl;
}

double* read_data(const char *filename, int from, int to) {
    int count = to - from;
    double *arr = (double *)malloc(count * sizeof(double));
    if (!arr) {
        std::cerr << "Failed to allocate memory\n";
        exit(1);
    }

    FILE *f = fopen(filename, "r");
    if (!f) {
        std::cerr << "Cannot open file " << filename << std::endl;
        exit(1);
    }

    double tmp;
    for (int i = 0; i < from; i++) {
        if (fscanf(f, "%lf", &tmp) != 1) {
            std::cerr << "Unexpected end of file while skipping\n";
            exit(1);
        }
    }

    for (int i = 0; i < count; i++) {
        if (fscanf(f, "%lf", &arr[i]) != 1) {
            std::cerr << "Failed to read element " << i << " from file\n";
            exit(1);
        }
    }

    fclose(f);
    return arr;
}

int main() {
    const int n = 100000;
    const char* filename = "bench.txt";

    std::ifstream check_file(filename);
    generate_random_data(filename, n);
    check_file.close();

    double *cpu_vec1 = read_data(filename, 0, n / 2);
    double *cpu_vec2 = read_data(filename, n / 2, n);

    double *gpu_vec1, *gpu_vec2;
    CUDA_CHECK(cudaMalloc(&gpu_vec1, (n / 2) * sizeof(double)));
    CUDA_CHECK(cudaMalloc(&gpu_vec2, (n / 2) * sizeof(double)));

    CUDA_CHECK(cudaMemcpy(gpu_vec1, cpu_vec1, (n / 2) * sizeof(double), cudaMemcpyHostToDevice));
    CUDA_CHECK(cudaMemcpy(gpu_vec2, cpu_vec2, (n / 2) * sizeof(double), cudaMemcpyHostToDevice));

    FILE *out = fopen("bench-out.txt", "w");
    if (!out) {
        std::cerr << "Cannot open output file\n";
        return 1;
    }

    for (int gridSize = 32; gridSize <= 1024; gridSize *= 2) {
        for (int blockSize = 32; blockSize <= 1024; blockSize *= 2) {
            cudaEvent_t start, stop;
            CUDA_CHECK(cudaEventCreate(&start));
            CUDA_CHECK(cudaEventCreate(&stop));

            CUDA_CHECK(cudaEventRecord(start));
            print_min_elements<<<gridSize, blockSize>>>(gpu_vec1, gpu_vec2, n / 2);
            CUDA_CHECK(cudaEventRecord(stop));

            CUDA_CHECK(cudaEventSynchronize(stop));

            float ms = 0;
            CUDA_CHECK(cudaEventElapsedTime(&ms, start, stop));

            fprintf(out, "<<grid: %d, block: %d>>, %.6f ms\n", gridSize, blockSize, ms);

            CUDA_CHECK(cudaEventDestroy(start));
            CUDA_CHECK(cudaEventDestroy(stop));
        }
    }

    fclose(out);

    cudaFree(gpu_vec1);
    cudaFree(gpu_vec2);
    free(cpu_vec1);
    free(cpu_vec2);

    std::cout << "Benchmark results saved to bench-out.txt\n";
    return 0;
}