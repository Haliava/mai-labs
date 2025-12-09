p, q = map(int, input().split())
if p % q != 0 or p < 2 * q:
  print(-1)
else:
  print(p - q, q)