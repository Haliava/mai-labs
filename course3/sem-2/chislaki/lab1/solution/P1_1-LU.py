import numpy as np
from scipy.linalg import lu as scipy_lu


def lu(A):
  n = len(A)
  P = np.eye(n)
  L = np.eye(n)
  U = A.copy()
  swap_count = 0

  for i in range(n):
    max_row = np.argmax(np.abs(U[i:, i])) + i
    if max_row != i:
      U[[i, max_row]] = U[[max_row, i]]
      P[[i, max_row]] = P[[max_row, i]]
      L[[i, max_row], :i] = L[[max_row, i], :i]

    swap_count += 1

    for j in range(i + 1, n):
      L[j, i] = U[j, i] / U[i, i]
      U[j, i:] -= L[j, i] * U[i, i:]

  return P, L, U, swap_count


def solve_lu(P, L, U, b):
  """
  Решает систему вида Ax = b, используя разложение PA = LU\n
  \n
  PA = LU, Ax = b =>\n
  PAx = Pb =>\n
  LUx = Pb\n
  Пусть y = Ux, тогда нам надо решить:\n
  1) Ly = Pb, 2) Ux = y

  :param P: перестановочная матрица (P⁻¹ = Pᵗ)
  :param L: нижняя треугольная матрица с единицами на диагонали
  :param U: верхняя треугольная матрица
  :param b: числовые значения в Ax = b
  """
  n = len(b)
  b_permuted = P @ b
  x = np.zeros(n)
  y = np.zeros(n)
  
  for i in range(n):
    y[i] = b_permuted[i] - np.dot(L[i, :i], y[:i])

  for i in range(n - 1, -1, -1):
    x[i] = (y[i] - np.dot(U[i, i + 1:], x[i + 1:])) / U[i, i]

  return x


def lu_det(A, swap_count):
  det_A = np.prod(np.diag(A))
  sign = (-1) ** swap_count
  return sign * det_A


def inv(A):
  """
    A X = I.
  """
  P, L, U, _ = lu(A)
  n = len(A)
  inv_A = np.zeros((n, n))
  for i in range(n):
    e = np.zeros(n)
    e[i] = 1
    inv_A[:, i] = solve_lu(P, L, U, e)
  return inv_A


A = np.array([
  [2, -7, 8, -4],
  [0, -1, 4, -1],
  [3, -4, 2, -1],
  [-9, 1, -4, 6]],
  dtype=float
)

b = np.array([57, 24, 28, 12], dtype=float)
P, L, U, swap_count = lu(A)
P_sc, L_sc, U_sc = scipy_lu(A)

print("P = \n", P)
print("L = \n", L)
print("U = \n", U)

print("x = ", solve_lu(P, L, U, b))
print("det A = ", lu_det(A, swap_count))
print("inv A = \n", inv(A))

print("Решение совпадает с библиотечным:", np.allclose(solve_lu(P, L, U, b), np.linalg.solve(A, b)))
