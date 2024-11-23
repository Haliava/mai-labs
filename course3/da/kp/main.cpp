#include <iostream>
#include <vector>
#include <algorithm>
#include <map>

using namespace std;

struct Segment {
    int l, r, h;
};

struct Point {
    int x, y, idx;
};

class BIT {
private:
    vector<int> tree;
    int size;
public:
    BIT(int n) {
        size = n + 2;
        tree.resize(size);
    }
    
    void update(int l, int r, int val) {
        for (int i = l; i <= size; i += i & -i)
            tree[i] += val;
        for (int i = r + 1; i <= size; i += i & -i)
            tree[i] -= val;
    }
    
    int query(int x) {
        int res = 0;
        for (int i = x; i > 0; i -= i & -i)
            res += tree[i];
        return res;
    }
};

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    
    int n, m;
    cin >> n >> m;
    
    vector<Segment> segments(n);
    for (int i = 0; i < n; ++i) {
        cin >> segments[i].l >> segments[i].r >> segments[i].h;
    }
    
    vector<Point> points(m);
    for (int i = 0; i < m; ++i) {
        cin >> points[i].x >> points[i].y;
        points[i].idx = i;
    }
    
    vector<int> all_x;
    for (auto& seg : segments) {
        all_x.push_back(seg.l);
        all_x.push_back(seg.r);
    }
    for (auto& p : points) {
        all_x.push_back(p.x);
    }
    sort(all_x.begin(), all_x.end());
    all_x.erase(unique(all_x.begin(), all_x.end()), all_x.end());
    map<int, int> x_compression;
    for (int i = 0; i < all_x.size(); ++i) {
        x_compression[all_x[i]] = i + 1;
    }
    
    sort(segments.begin(), segments.end(), [](const Segment& a, const Segment& b) {
        return a.h > b.h;
    });
    
    sort(points.begin(), points.end(), [](const Point& a, const Point& b) {
        return a.y > b.y;
    });
    
    vector<int> ans(m);
    BIT bit(all_x.size());
    int seg_ptr = 0;
    for (int i = 0; i < m; ++i) {
        while (seg_ptr < n && segments[seg_ptr].h > points[i].y) {
            int l = x_compression[segments[seg_ptr].l];
            int r = x_compression[segments[seg_ptr].r];
            bit.update(l, r, 1);
            seg_ptr++;
        }
        int x = x_compression[points[i].x];
        ans[points[i].idx] = bit.query(x);
    }
    
    for (int i = 0; i < m; ++i) {
        cout << ans[i] << endl;
    }
    
    return 0;
}