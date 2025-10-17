#include <iostream>
#include <vector>
#include <algorithm>
#include <random>
#include <chrono>

// Функция, которая поэлементно выбирает минимум из двух векторов
std::vector<int> elementwise_min(const std::vector<int>& a, const std::vector<int>& b) {
    if (a.size() != b.size()) {
        throw std::invalid_argument("Vectors must have the same size");
    }
    std::vector<int> result;
    result.reserve(a.size());
    for (size_t i = 0; i < a.size(); ++i) {
        result.push_back(std::min(a[i], b[i]));
    }
    return result;
}

// Альтернативная версия с использованием std::transform
std::vector<int> elementwise_min_transform(const std::vector<int>& a, const std::vector<int>& b) {
    if (a.size() != b.size()) {
        throw std::invalid_argument("Vectors must have the same size");
    }
    std::vector<int> result(a.size());
    std::transform(a.begin(), a.end(), b.begin(), result.begin(),
                   [](int x, int y) { return std::min(x, y); });
    return result;
}

int main() {
    const size_t N = 1000; // Количество элементов

    // Генерация случайных данных
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<int> dis(1, 100'000);

    std::vector<int> vec1(N);
    std::vector<int> vec2(N);

    for (size_t i = 0; i < N; ++i) {
        vec1[i] = dis(gen);
        vec2[i] = dis(gen);
    }

    auto start = std::chrono::high_resolution_clock::now();
    auto result1 = elementwise_min(vec1, vec2);
    auto end = std::chrono::high_resolution_clock::now();
    auto duration1 = end - start;

    std::cout << "N = " << N << "\n";
    std::cout << "Loop version time: " << duration1.count() / 1000000.0 << " ms\n";

    return 0;
}
