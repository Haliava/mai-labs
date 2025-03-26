#include <iostream>
#include <vector>
#include <queue>
#include <limits>
#include <algorithm>
using namespace std;

const long long INF = numeric_limits<long long>::max();

struct Edge {
  int u, v;
  long long weight;
};

bool bellmanFord(int n, const vector<Edge>& edges, vector<long long>& h) {
  h.assign(n + 1, INF);
  h[n] = 0;

  for (int i = 0; i < n; ++i) {
    for (const auto& edge : edges) {
      if (h[edge.u] != INF && h[edge.u] + edge.weight < h[edge.v]) {
        h[edge.v] = h[edge.u] + edge.weight;
      }
    }
  }

  for (const auto& edge : edges) {
    if (h[edge.u] != INF && h[edge.u] + edge.weight < h[edge.v]) {
      return false;
    }
  }
  return true;
}

void dijkstra(int src, int n, const vector<vector<pair<int, long long>>>& graph, vector<long long>& dist) {
  dist.assign(n, INF);
  dist[src] = 0;

  priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;
  pq.emplace(0, src);

  while (!pq.empty()) {
    auto [d, u] = pq.top();
    pq.pop();

    if (d > dist[u]) continue;

    for (const auto& [v, weight] : graph[u]) {
      if (dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        pq.emplace(dist[v], v);
      }
    }
  }
}

int main() {
  int n, m;
  cin >> n >> m;

  vector<Edge> edges;
  vector<vector<pair<int, long long>>> graph(n);

  for (int i = 0; i < m; ++i) {
    int u, v;
    long long weight;
    cin >> u >> v >> weight;
    --u, --v;
    edges.push_back({u, v, weight});
    graph[u].emplace_back(v, weight);
  }

  vector<long long> h;
  edges.push_back({n, 0, 0});
  for (int i = 1; i < n; ++i) {
    edges.push_back({n, i, 0});
  }

  if (!bellmanFord(n, edges, h)) {
    cout << "Negative cycle\n";
    return 0;
  }

  vector<vector<long long>> result(n, vector<long long>(n, INF));
  for (int u = 0; u < n; ++u) {
    for (auto& edge : graph[u]) {
      edge.second += h[u] - h[edge.first];
    }
  }

  for (int u = 0; u < n; ++u) {
    vector<long long> dist;
    dijkstra(u, n, graph, dist);

    for (int v = 0; v < n; ++v) {
      if (dist[v] != INF) {
        result[u][v] = dist[v] - h[u] + h[v];
      }
    }
  }

  for (const auto& row : result) {
    for (int i = 0; i < n; ++i) {
      if (row[i] == INF) cout << "inf ";
      else cout << row[i] << " ";
    }
    cout << "\n";
  }

  return 0;
}
