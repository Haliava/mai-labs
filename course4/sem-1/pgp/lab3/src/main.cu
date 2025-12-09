#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <cuda_runtime.h>
#include <device_launch_parameters.h>
#include <cfloat>
#include <cmath>
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <iomanip>

#define MAX_CLASSES 32

#define CSC(call)  									                \
do {											                    \
	cudaError_t res = call;							                \
	if (res != cudaSuccess) {							            \
		fprintf(stderr, "ERROR in %s:%d. Message: %s\n",			\
				__FILE__, __LINE__, cudaGetErrorString(res));		\
		exit(0);								                    \
	}										                        \
} while(0)

struct Image {
  int width = 0;
  int height = 0;
  std::vector<uchar4> pixels;

  Image(int w = 0, int h = 0) : width(w), height(h), pixels(w * h) {}
};

struct Task {
  std::string in_path;
  std::string out_path;
  int nc = 0;
  std::vector<std::vector<std::pair<int, int>>> samples;
};

__constant__ float c_norm_avg[MAX_CLASSES][3];
__constant__ int c_num_classes;

__global__ void classifySpectralAngleKernel(const uchar4* in_pixels, uchar4* out_pixels, int num_pixels) {
    int global_idx = blockIdx.x * blockDim.x + threadIdx.x;
    int total_threads = gridDim.x * blockDim.x;

    for (int i = global_idx; i < num_pixels; i += total_threads) {
        uchar4 p_in = in_pixels[i];
        float p[3];
        p[0] = (float)p_in.x; // R
        p[1] = (float)p_in.y; // G
        p[2] = (float)p_in.z; // B

        float mag_p = sqrtf(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
        float p_norm0 = 0.0f, p_norm1 = 0.0f, p_norm2 = 0.0f;
        if (mag_p > 1e-6f) {
            p_norm0 = p[0] / mag_p;
            p_norm1 = p[1] / mag_p;
            p_norm2 = p[2] / mag_p;
        }
        
        int best_class = 0;
        float max_dot_product = -FLT_MAX;

        for (int j = 0; j < c_num_classes; j++) {
            float norm_avg_j[3];
            norm_avg_j[0] = c_norm_avg[j][0];
            norm_avg_j[1] = c_norm_avg[j][1];
            norm_avg_j[2] = c_norm_avg[j][2];

            float dot_product = p_norm0 * norm_avg_j[0] + p_norm1 * norm_avg_j[1] + p_norm2 * norm_avg_j[2];
            
            if (dot_product > max_dot_product) {
                max_dot_product = dot_product;
                best_class = j;
            }
        }
        
        uchar4 p_out = p_in;
        p_out.w = (unsigned char)best_class;
 
        out_pixels[i] = p_out;
    }
}
void read_image(const std::string& path, Image& img) {
    std::ifstream file(path, std::ios::binary);

    file.read(reinterpret_cast<char*>(&img.width), sizeof(int));
    file.read(reinterpret_cast<char*>(&img.height), sizeof(int));

    img.pixels.resize(img.width * img.height);
    file.read(reinterpret_cast<char*>(img.pixels.data()), img.pixels.size() * sizeof(uchar4));
}

void write_image(const std::string& path, const Image& img) {
    std::ofstream file(path, std::ios::binary);

    file.write(reinterpret_cast<const char*>(&img.width), sizeof(int));
    file.write(reinterpret_cast<const char*>(&img.height), sizeof(int));
    file.write(reinterpret_cast<const char*>(img.pixels.data()), img.pixels.size() * sizeof(uchar4));
}

void read_task(Task& task) {
    std::string line;

    std::getline(std::cin, task.in_path);
    std::getline(std::cin, task.out_path);
    std::getline(std::cin, line);

    task.nc = std::stoi(line);
    task.samples.resize(task.nc);
    

    for (int j = 0; j < task.nc; ++j) {
        std::getline(std::cin, line);

        std::stringstream ss(line);
        int np_j;
        ss >> np_j;

        for (int i = 0; i < np_j; ++i) {
            int x, y;
            ss >> x >> y;
            task.samples[j].push_back({y, x});
        }
    }
}

int main() {
    Task task;
    read_task(task);

    Image h_in_image;
    read_image(task.in_path, h_in_image);

    Image h_out_image(h_in_image.width, h_in_image.height);
    int num_pixels = h_in_image.width * h_in_image.height;

    float h_norm_avg[MAX_CLASSES][3] = {0};
    
    for (int j = 0; j < task.nc; ++j) {
        int np_j = task.samples[j].size();
        if (np_j == 0) continue;

        double sum_r = 0, sum_g = 0, sum_b = 0;

        for (const auto& coord : task.samples[j]) {
            int y = coord.first;
            int x = coord.second;
            if (y >= h_in_image.height || x >= h_in_image.width) {
                return 1;
            }
            uchar4 p = h_in_image.pixels[y * h_in_image.width + x];
            sum_r += p.x;
            sum_g += p.y;
            sum_b += p.z;
        }

        float avg_j[3];
        avg_j[0] = (float)(sum_r / np_j);
        avg_j[1] = (float)(sum_g / np_j);
        avg_j[2] = (float)(sum_b / np_j);

        float mag = sqrt(avg_j[0] * avg_j[0] + avg_j[1] * avg_j[1] + avg_j[2] * avg_j[2]);
                         
        if (mag > 1e-6) {
            h_norm_avg[j][0] = avg_j[0] / mag;
            h_norm_avg[j][1] = avg_j[1] / mag;
            h_norm_avg[j][2] = avg_j[2] / mag;
        } else {
            h_norm_avg[j][0] = 0;
            h_norm_avg[j][1] = 0;
            h_norm_avg[j][2] = 0;
        }
        
    }

    uchar4* d_in_pixels;
    uchar4* d_out_pixels;
    size_t img_size_bytes = num_pixels * sizeof(uchar4);

    CSC(cudaMalloc(&d_in_pixels, img_size_bytes));
    CSC(cudaMalloc(&d_out_pixels, img_size_bytes));

    CSC(cudaMemcpy(d_in_pixels, h_in_image.pixels.data(), img_size_bytes, cudaMemcpyHostToDevice));

    CSC(cudaMemcpyToSymbol(c_num_classes, &task.nc, sizeof(int)));
    CSC(cudaMemcpyToSymbol(c_norm_avg, h_norm_avg, task.nc * 3 * sizeof(float)));

    classifySpectralAngleKernel<<<1024, 1024>>>(d_in_pixels, d_out_pixels, num_pixels);
    CSC(cudaGetLastError());
    CSC(cudaDeviceSynchronize());

    CSC(cudaMemcpy(h_out_image.pixels.data(), d_out_pixels, img_size_bytes, cudaMemcpyDeviceToHost));

    write_image(task.out_path, h_out_image);

    CSC(cudaFree(d_in_pixels));
    CSC(cudaFree(d_out_pixels));
    
    return 0;
}