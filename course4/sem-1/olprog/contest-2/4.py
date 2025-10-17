def calculate_dp(word):
  dp = []
  for i in range(len(word)):
    dp.append([9999] * len(word))

  for i in range(len(word) - 1):
    dp[i][i] = 0
    dp[i][i + 1] = int(word[i] != word[i + 1])
  dp[len(word) - 1][len(word) - 1] = 0

  for length in range(3, len(word) + 1):
    for i in range(len(word) - length + 1):
      j = i + length - 1
      
      if (word[i] == word[j]):
        dp[i][j] = dp[i + 1][j - 1]
      else:
        dp[i][j] = min(dp[i + 1][j - 1], dp[i + 1][j], dp[i][j - 1]) + 1
  
  return dp[0][len(word) - 1]


assert calculate_dp('racecar') == 0
assert calculate_dp('aaaaba') == 1
assert calculate_dp('hello') == 2
assert calculate_dp('palindrome') == 5
assert calculate_dp('aba') == 0
assert calculate_dp('abb') == 1
assert calculate_dp('abba') == 0
assert calculate_dp('abab') == 1
assert calculate_dp('abbb') == 1
assert calculate_dp('aabb') == 2
assert calculate_dp('x') == 0
assert calculate_dp('bababac') == 1

n = int(input())
for i in range(n):
  print(calculate_dp(input()))
