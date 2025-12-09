for i in range(int(input())):
  x, n = map(int, input().split())
  if n > x:
    print(-1)
  else:
    avg_num = x // n
    remainder = x % n
    arr = [avg_num] * (n - remainder) + [avg_num + 1] * remainder
    print(' '.join(map(str, arr)))
