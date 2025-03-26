#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <iomanip>

using namespace std;

double calculateArea(double a, double b, double c) {
    double p = (a + b + c) / 2.0;
    return sqrt(p * (p - a) * (p - b) * (p - c));
}

int main() {
  int N;
  cin >> N;
  vector<int> segments(N);
  double maxArea = 0;
  vector<int> bestTriangle;
  
  for (int i = 0; i < N; ++i) {
    cin >> segments[i];
  }
  
  sort(segments.begin(), segments.end(), greater<int>());
  
  for (int i = N - 2; i >= 0; --i) {
    auto [a, b, c] = std::tie(segments[i], segments[i + 1], segments[i + 2]);
    
    if (a < b + c) {
      double area = calculateArea(a, b, c);
      if (area > maxArea) {
        maxArea = area;
        bestTriangle = {c, b, a};
      }
    }
  }
  
  if (bestTriangle.empty()) {
    cout << 0 << endl;
  } else {
    cout << fixed << setprecision(3) << maxArea << endl;
    cout << bestTriangle[0] << " " << bestTriangle[1] << " " << bestTriangle[2] << endl;
  }
  
  return 0;
}
