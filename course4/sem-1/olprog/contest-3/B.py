def generate_password(password):
  groups = {}
  res = list(password)

  for i in range(len(password)):
    left_bit = (i + 1).bit_length()
    if left_bit not in groups:
      groups[left_bit] = []
    groups[left_bit].append(i)
  
  for group in groups.values():
    chars = [res[i] for i in group]
    chars.sort()
    group.sort()
    for i, char in zip(group, chars):
      res[i] = char

  return ''.join(res)

n = int(input())
for i in range(n):
  print(generate_password(input()))
