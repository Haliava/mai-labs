#include <iostream>
#include <vector>
#include <algorithm>
#include <map>
#include <set>

using namespace std;

struct Segment {
    int l, r, h;
};

struct Node {
    int l, r, cnt;
    Node *left, *right;
    Node(int _l, int _r) : l(_l), r(_r), cnt(0), left(nullptr), right(nullptr) {}
};

int n, m;
vector<Segment> segments;
set<int> x_set;
map<int, int> x_rank;
vector<Node*> roots;

Node* update(Node* prev, int l, int r, int a, int b) {
    if (a >= b) return prev;
    Node* newNode = new Node(l, r);
    if (prev) *newNode = *prev;
    if (l + 1 == r) {
        newNode->cnt++;
        return newNode;
    }
    int mid = (l + r) / 2;
    if (a < mid) {
        newNode->left = update(prev ? prev->left : nullptr, l, mid, a, b);
    }
    if (b > mid) {
        newNode->right = update(prev ? prev->right : nullptr, mid, r, a, b);
    }
    newNode->cnt = 0;
    if (newNode->left) newNode->cnt += newNode->left->cnt;
    if (newNode->right) newNode->cnt += newNode->right->cnt;
    return newNode;
}

int query(Node* node, int l, int r, int x) {
    if (!node || x < l || x >= r) return 0;
    if (l + 1 == r) return node->cnt;
    int mid = (l + r) / 2;
    if (x < mid) return query(node->left, l, mid, x);
    else return query(node->right, mid, r, x);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);

    cin >> n >> m;
    segments.resize(n);
    for (int i = 0; i < n; ++i) {
        cin >> segments[i].l >> segments[i].r >> segments[i].h;
        x_set.insert(segments[i].l);
        x_set.insert(segments[i].r);
    }

    vector<pair<int, int>> points(m);
    for (int i = 0; i < m; ++i) {
        cin >> points[i].first >> points[i].second;
        x_set.insert(points[i].first);
    }

    int rank = 1;
    for (auto x : x_set) {
        x_rank[x] = rank++;
    }

    sort(segments.begin(), segments.end(), [](const Segment& a, const Segment& b) {
        return a.h > b.h;
    });

    roots.push_back(nullptr); 
    for (int i = 0; i < n; ++i) {
        int l = x_rank[segments[i].l];
        int r = x_rank[segments[i].r];
        roots.push_back(update(roots.back(), 1, rank, l, r));
    }

    for (int i = 0; i < m; ++i) {
        int x = points[i].first;
        int y = points[i].second;

        int pos = lower_bound(segments.begin(), segments.end(), y, [](const Segment& a, int b) {
            return a.h > b;
        }) - segments.begin();

        Node* version = (pos == 0) ? nullptr : roots[pos];

        int cnt = query(version, 1, rank, x_rank[x]);
        cout << cnt << '\n';
    }

    return 0;
}
