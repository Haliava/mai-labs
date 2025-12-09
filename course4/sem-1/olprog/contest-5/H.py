n = int(input())
multiplication_stack = []
current_multiplication = 1
res = 0

for i in range(n):
  actionValue = input().split(' ')
  if actionValue[0] == 'end':
    current_multiplication = multiplication_stack.pop()
    continue
  action, value = actionValue
  if action == 'for':
    multiplication_stack.append(int(value))
    current_multiplication = (current_multiplication * int(value)) % 1000000007
  if action == 'calc':
    res = (res + int(value) * current_multiplication) % 1000000007

print(res % 1000000007)
