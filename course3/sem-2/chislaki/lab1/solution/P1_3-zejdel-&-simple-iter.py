import numpy as np


def matrix_inf_norm(alpha):
  return max(np.sum(np.abs(alpha), axis=1))


def solve_simple_iteration(A, b, tolerance=1e-6, max_iterations=1000):
  n = len(b)
  x = np.zeros(n)
  iterations = 0

  alpha = np.zeros((n, n))
  beta = np.zeros(n)
  for i in range(n):
    beta[i] = b[i] / A[i, i]
    for j in range(n):
      if i != j:
        alpha[i, j] = -A[i, j] / A[i, i]
  
  alpha_norm = matrix_inf_norm(alpha)
  coefficient = alpha_norm / (1 - alpha_norm)
  for _ in range(max_iterations):
    x_new = np.dot(alpha, x) + beta
    diff_norm = np.max(np.abs(x_new - x))
    
    if alpha_norm <= 1:
      if coefficient * diff_norm < tolerance:
        break
    else:
      if diff_norm < tolerance:
        break
        
    x = x_new
    iterations += 1
  
  return x, iterations


def solve_zeidel(A, b, tolerance=1e-10, max_iterations=1000):
  n = len(b)
  x = np.zeros(n)
  iterations = 0

  alpha = np.zeros((n, n))
  beta = np.zeros(n)
  for i in range(n):
    beta[i] = b[i] / A[i, i]
    for j in range(n):
      if i != j:
        alpha[i, j] = -A[i, j] / A[i, i]
  
  alpha_norm = matrix_inf_norm(alpha)
  coefficient = alpha_norm / (1 - alpha_norm)
  for _ in range(max_iterations):
    x_new = np.copy(x)
    for i in range(n):
      x_new[i] = (b[i] - np.dot(A[i, :i], x_new[:i]) - np.dot(A[i, i+1:], x_new[i+1:])) / A[i, i]
    
    diff_norm = np.max(np.abs(x_new - x))
    if alpha_norm >= 1:
      if diff_norm < tolerance:
        break
    else:
      if coefficient * diff_norm < tolerance:
        break
        
    x = x_new
    iterations += 1

  return x, iterations


A = np.array([
  [-24, -6, 4, 7],
  [-8, 21, 4, -2],
  [6, 6, 16, 0],
  [-7, -7, 5, 24]
], dtype=float)
b = np.array([130, 139, -84, -165], dtype=float)

x_simple, iter_simple = solve_simple_iteration(A, b, tolerance=1e-6)
print("Метод простых итераций:")
print("Решение:", x_simple)
print("Количество итераций:", iter_simple)

x_seidel, iter_zeidel = solve_zeidel(A, b, tolerance=1e-6)
print("\nМетод Зейделя:")
print("Решение:", x_seidel)
print("Количество итераций:", iter_zeidel)
