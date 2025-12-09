length, n = map(int, input().split())
plays = input()

steps4 = [0] * (length + 1)
steps8 = [0] * (length + 1)

for i in range(1, length + 1):
  steps4[i] = steps4[i - 1] + int(plays[i - 1] == '4')
  steps8[i] = steps8[i - 1] + int(plays[i - 1] == '8')

for _ in range(n):
  l, r, x, y = map(int, input().split())
  res8 = steps8[r] - steps8[l - 1]
  res4 = steps4[r] - steps4[l - 1]

  if (max(0, abs(x) - res8) + max(0, abs(y) - res8)) <= res4:
    print("YES")
  else:
    print("NO")
