calculate_total_edges = lambda x: x * (x - 1) // 2
n, m = map(int, input().split(' '))

if (n > calculate_total_edges(n)):
  print(-1)
else:
  x = 1
  while calculate_total_edges(x) < m:
    x += 1

  d_min = n - m if m < n - 1 else 1
  d_max = n - x + 1
  print(f'{d_min} {d_max}')
