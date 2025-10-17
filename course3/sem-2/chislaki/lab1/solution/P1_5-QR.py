import numpy as np


def qr_decomposition(A):
  """
  Выполняет QR-разложение квадратной матрицы A с использованием метода отражений Хаусхолдера

  :param A: квадратная матрица размера n x n

  :returns:
    Q: ортогональная матрица (n x n)
    R: верхнетреугольная матрица (n x n), равная преобразованной A
  """
  n = len(A)
  A = np.copy(A)
  Q = np.eye(n)

  for i in range(n):
    v = np.zeros((n, 1))
    norm = np.sqrt(sum([A[j][i] ** 2 for j in range(i, n)]))
    v[i] = A[i][i] + np.sign(A[i][i]) * norm
    
    for j in range(i + 1, n):
      v[j] = A[j][i]
    
    vT = np.transpose(v)  
    denominator = np.dot(vT, v)  
    if denominator == 0:
      H = np.eye(n)
    else:
      H = np.eye(n) - 2 / denominator * np.dot(v, vT)
    
    Q = np.dot(Q, H)  
    A = np.dot(H, A)  

  return Q, A


def solve_qr(A, eps):
  """
  Реализует QR-алгоритм для нахождения собственных значений квадратной матрицы A

  :returns:
    lambdas, где:
      lambdas[i][0] — вещественная часть i-го собственного значения,
      lambdas[i][1] — мнимая часть i-го собственного значения
    iterations: количество выполненных итераций
  """
  n = len(A)
  A = np.copy(A)
  iterations = 0
  lambdas = np.empty((n, 2))

  while True:
    iterations += 1
    Q, R = qr_decomposition(A)
    A = np.dot(R, Q)

    flg = True   
    skip = False 
    for i in range(n):
      if skip:
        skip = False
        continue
      
      if i < n - 1:
        a = A[i][i]
        d = A[i + 1][i + 1]
        b = A[i][i + 1]
        c = A[i + 1][i]
        D = a ** 2 + d ** 2 - 2 * a * d + 4 * b * c  

        if D < 0:
          re = (a + d) / 2.0
          im = np.sqrt(-D) / 2.0
          lambda_ = np.sqrt(re ** 2 + im ** 2)
          if iterations > 1:
            lambdaPrev = np.sqrt(lambdas[i][0] ** 2 + lambdas[i][1] ** 2)
            if abs(lambda_ - lambdaPrev) > eps:
              flg = False  
          
          lambdas[i][0] = re
          lambdas[i][1] = im
          lambdas[i + 1][0] = re
          lambdas[i + 1][1] = -im

          skip = True  
          continue
      
      lambdas[i][0] = A[i][i]
      lambdas[i][1] = 0.0
      
      sum_ = np.sqrt(sum([A[j][i] ** 2 for j in range(i + 1, n)]))
      if sum_ > eps:
        flg = False  

    if flg:
      break  

  return lambdas, iterations

A = np.array([
  [1, 5, -6],
  [9, -7, -9],
  [6, -1, -9]
])

Q, R = qr_decomposition(A)
print("Q:")
print(Q)
print("R:")
print(R)

Q_my, R_my = qr_decomposition(A)
Q_lib, R_lib = np.linalg.qr(A)

ortho_my = np.allclose(Q_my.T @ Q_my, np.eye(len(A)), atol=1e-10)
ortho_lib = np.allclose(Q_lib.T @ Q_lib, np.eye(len(A)), atol=1e-10)

print(f"\nОртогональность Q (своя): {ortho_my}")
print(f"Ортогональность Q (библиотека): {ortho_lib}")

lam, iterations = solve_qr(A, 0.01)
print("Собственные значения (вещественная и мнимая части):")
print(lam)
print("Количество итераций:", iterations)
