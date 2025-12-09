n, x = map(int, input().split())
current_len = n
current_index = x
path = []
while current_len > 1:
  if current_index % 2 == 0:
    current_len //= 2
    current_index //= 2
    path.append('1')
  else:
    current_len = (current_len + 1) // 2
    current_index = (current_index + 1) // 2
    path.append('0')

print(' '.join(path))
