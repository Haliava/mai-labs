import numpy as np
import matplotlib.pyplot as plt

def jacobi_eigenvalue(A, tolerance=1e-20):
  """
  Вычисляет собственные значения и собственные векторы симметричной матрицы
  используя повороты

  :param A: Входная симметричная матрица, должна удовлетворять A == Aᵗ
  :param tolerance: Порог сходимости: алгоритм останавливается,
    когда сумма квадратов всех внедиагональных элементов становится меньше tolerance.
  """
  n = A.shape[0]
  V = np.eye(n)  
  error_history = []

  while True:
    off_diag_sum = np.sum(np.square(A - np.diag(np.diag(A))))
    error_history.append(off_diag_sum)

    if off_diag_sum < tolerance:
      break

    without_diag = A - np.diag(np.diag(A))
    max_abs_of_non_diag = np.argmax(np.abs(without_diag))
    p, q = np.unravel_index(max_abs_of_non_diag, A.shape)

    theta = 0.5 * np.arctan(2 * A[p, q] / (A[p, p] - A[q, q])) if A[p, p] != A[q, q] else np.pi / 4

    J = np.eye(n)
    J[p, p] = np.cos(theta)
    J[q, q] = np.cos(theta)
    J[p, q] = -np.sin(theta)
    J[q, p] = np.sin(theta)

    A = J.T @ A @ J
    V = V @ J

  eigenvalues = np.diag(A)
  eigenvectors = V

  return eigenvalues, eigenvectors, error_history

A = np.array([
  [9, -5, -6],
  [-5, 1, -8],
  [-6, -8, -3]
])

eigenvalues, eigenvectors, error_history = jacobi_eigenvalue(A, tolerance=1e-10)

print("Собственные значения:")
print(eigenvalues)
print("\nСобственные векторы:")
print(eigenvectors)

plt.plot(error_history)
plt.xlabel('Итерации')
plt.ylabel('Сумма квадратов внедиагональных элементов')
plt.title('Зависимость суммы квадратов внедиагональных элементов от числа итераций')
plt.show()
