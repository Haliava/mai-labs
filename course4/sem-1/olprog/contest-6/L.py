n = int(input().strip())
MAX_KAL = 10**18

if n == 0:
  print("YES")
  print(1, 1)
else:
  b = 1
  a = n ^ b
  if a >= 1 and a <= MAX_KAL:
    print("YES")
    print(a, b)
  else:
    b = 2
    a = n ^ b
    if a >= 1 and a <= MAX_KAL:
      print("YES")
      print(a, b)
    else:
      b = 1 << 59
      a = n ^ b
      print("YES")
      print(a, b)