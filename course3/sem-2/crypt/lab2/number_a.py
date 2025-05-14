from sympy import factorint, isprime

# вариант 97
# ответ a = 11995651687853761981 * 6277101735386680763835789423207666416102355444464034513029
a = 75297926026921015514579506355424837332308088705857347700074296919019009350449
factors = factorint(a)
keys = list(factors.keys()) 
for key in keys:
    print(f"{key} - {'PRIME' if isprime(key) else "NOT PRIME"}")