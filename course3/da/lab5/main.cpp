#include <iostream>
#include <vector>
#include <string>
#include <set>
#include <algorithm>

using namespace std;

const char DELIMITER_0 = '\0';
const char DELIMITER_1 = '\1';

vector<int> buildSuffixArray(const string& s) {
    int n = s.size();
    vector<int> suffArr(n);
    vector<int> rank(n), tempRank(n);

    for (int i = 0; i < n; ++i) {
        suffArr[i] = i;
        rank[i] = s[i];
    }

    for (int k = 1; k < n; k *= 2) {
        auto comparator = [&](int a, int b) {
            if (rank[a] != rank[b]) {
              return rank[a] < rank[b];
            }
            
            int ra = (a + k < n) ? rank[a + k] : -1;
            int rb = (b + k < n) ? rank[b + k] : -1;
            return ra < rb;
        };

        sort(suffArr.begin(), suffArr.end(), comparator);

        tempRank[suffArr[0]] = 0;
        for (int i = 1; i < n; ++i) {
            tempRank[suffArr[i]] = tempRank[suffArr[i - 1]] + comparator(suffArr[i - 1], suffArr[i]);
        }
        rank.swap(tempRank);
    }

    return suffArr;
}

vector<int> buildLCPArray(const string& s, const vector<int>& suffArr) {
    int n = s.size();
    vector<int> lcp(n - 1);
    vector<int> isa(n);

    for (int i = 0; i < n; ++i) {
        isa[suffArr[i]] = i;
    }

    int h = 0;
    for (int i = 0; i < n; ++i) {
        if (isa[i] == 0) {
          continue;
        }

        int j = suffArr[isa[i] - 1];
        while (i + h < n && j + h < n && s[i + h] == s[j + h]) {
          ++h;
        }

        lcp[isa[i] - 1] = h;
        if (h > 0) {
          --h;
        }
    }

    return lcp;
}

vector<int> determineOrigin(const vector<int>& suffArr, int len1, int len2) {
    vector<int> origin(suffArr.size());
    for (int i = 0; i < suffArr.size(); ++i) {
        if (suffArr[i] < len1) origin[i] = 1;
        else if (suffArr[i] > len1 && suffArr[i] < len1 + 1 + len2) origin[i] = 2;
        else origin[i] = 0;
    }
    return origin;
}

int main() {
    string s1, s2;
    cin >> s1 >> s2;

    string s = s1 + DELIMITER_0 + s2 + DELIMITER_1;

    vector<int> suffArr = buildSuffixArray(s);
    vector<int> lcp = buildLCPArray(s, suffArr);
    vector<int> origin = determineOrigin(suffArr, s1.size(), s2.size());

    int maxLCP = 0;
    set<string> substrings;

    for (int i = 0; i < lcp.size(); ++i) {
        if (origin[i] != 0 && origin[i + 1] != 0 && origin[i] != origin[i + 1]) {
            if (lcp[i] > maxLCP) {
                maxLCP = lcp[i];
                substrings.clear();
                substrings.insert(s.substr(suffArr[i], lcp[i]));
            } else if (lcp[i] == maxLCP) {
                substrings.insert(s.substr(suffArr[i], lcp[i]));
            }
        }
    }

    cout << maxLCP << endl;
    for (const auto& substr : substrings) {
        cout << substr << endl;
    }

    return 0;
}
