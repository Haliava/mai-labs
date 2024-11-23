#include <iostream>
#include <vector>
#include <string>
#include <set>
#include <algorithm>

using namespace std;

void build_suffix_array(const string& s, vector<int>& sa) {
    int n = s.size();
    sa.resize(n);
    vector<int> rank(n);
    for (int i = 0; i < n; ++i) {
        sa[i] = i;
        rank[i] = s[i];
    }
    for (int k = 1; k < n; k *= 2) {
        sort(sa.begin(), sa.end(), [&rank, k, n](int a, int b) {
            if (rank[a] != rank[b]) return rank[a] < rank[b];
            int ra = a + k < n ? rank[a + k] : -1;
            int rb = b + k < n ? rank[b + k] : -1;
            return ra < rb;
        });
        vector<int> new_rank(n);
        new_rank[sa[0]] = 0;
        for (int i = 1; i < n; ++i) {
            if (rank[sa[i]] == rank[sa[i-1]] && 
                (sa[i]+k < n ? rank[sa[i]+k] : -1) == (sa[i-1]+k < n ? rank[sa[i-1]+k] : -1)) {
                new_rank[sa[i]] = new_rank[sa[i-1]];
            } else {
                new_rank[sa[i]] = new_rank[sa[i-1]] + 1;
            }
        }
        rank = new_rank;
        if (rank[sa[n-1]] == n-1) break;
    }
}

void build_lcp_array(const string& s, const vector<int>& sa, vector<int>& lcp, const vector<int>& isa) {
    int n = sa.size();
    lcp.resize(n-1);
    int h = 0;
    for (int i = 0; i < n; ++i) {
        if (isa[i] > 0) {
            int j = sa[isa[i]-1];
            while (i + h < n && j + h < n && s[i+h] == s[j+h]) {
                h++;
            }
            lcp[isa[i]-1] = h;
            if (h > 0) h--;
        }
    }
}

vector<int> determine_origin(const vector<int>& sa, int len_s1, int len_s2) {
    vector<int> origin(sa.size());
    for (int i = 0; i < sa.size(); ++i) {
        if (sa[i] < len_s1) {
            origin[i] = 1;
        } else if (sa[i] > len_s1 && sa[i] < len_s1 + 1 + len_s2) {
            origin[i] = 2;
        } else {
            origin[i] = 0;
        }
    }
    return origin;
}

int main() {
    string s1, s2;
    cin >> s1 >> s2;
    char delimiter1 = '\0';
    char delimiter2 = '\1';
    string s = s1 + delimiter1 + s2 + delimiter2;
    vector<int> sa;
    build_suffix_array(s, sa);
    vector<int> isa(s.size());
    for (int i = 0; i < sa.size(); ++i) {
        isa[sa[i]] = i;
    }
    vector<int> lcp;
    build_lcp_array(s, sa, lcp, isa);
    vector<int> origin = determine_origin(sa, s1.size(), s2.size());
    int max_lcp = 0;
    set<string> substrings;
    for (int i = 0; i < lcp.size(); ++i) {
        if (origin[i] != origin[i+1] && origin[i] != 0 && origin[i+1] != 0) {
            if (lcp[i] > max_lcp) {
                max_lcp = lcp[i];
                substrings.clear();
                substrings.insert(s.substr(sa[i], lcp[i]));
            } else if (lcp[i] == max_lcp) {
                substrings.insert(s.substr(sa[i], lcp[i]));
            }
        }
    }
    cout << max_lcp << endl;
    for (const string& substr : substrings) {
        cout << substr << endl;
    }
    return 0;
}