#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int maxRectangleWithZeros(const vector<vector<int>>& matrix, int n, int m) {
	if (n == 0 || m == 0) return 0;
	vector<int> height(m, 0);
	int maxArea = 0;

	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < m; ++j) {
			height[j] = matrix[i][j] == 0 ? height[j] + 1: 0;
		}

		for (int j = 0; j < m; ++j) {
			if (height[j] <= 0) {
				continue;
			}

			int minHeight = height[j];
			for (int k = j; k < m && height[k] > 0; ++k) {
				minHeight = min(minHeight, height[k]);
				int width = k - j + 1;
				maxArea = max(maxArea, minHeight * width);
			}
		}
	}

	return maxArea;
}

int main() {
    char ch;
	int n, m;
	cin >> n >> m;
	vector<vector<int>> matrix(n, vector<int>(m));

	for (int i = 0; i < n; ++i) {
		for (int j = 0; j < m; ++j) {
			cin >> ch;
			matrix[i][j] = ch - '0';
		}
	}

	cout << maxRectangleWithZeros(matrix, n, m) << endl;
	return 0;
}
