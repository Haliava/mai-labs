import numpy as np
import matplotlib.pyplot as plt
from lab1.solution import lu, solve_lu

x = np.array([0.1, 0.5, 0.9, 1.3, 1.7, 2.1])
y = np.array([10, 2, 1.1111, 0.76923, 0.58824, 0.47619])


def build_normal_system(x, y, degree):
  A = np.zeros((degree + 1, degree + 1))
  b = np.zeros(degree + 1)

  for k in range(degree + 1):
    for i in range(degree + 1):
      A[k, i] = np.sum(x ** (i + k))
    b[k] = np.sum(y * (x ** k))

  return A, b


def fit_polynomial(x, y, degree):
  A, b = build_normal_system(x, y, degree)
  P, L, U, _ = lu(A)
  coeffs = solve_lu(P,L,U, b)
  y_pred = np.zeros_like(x, dtype=float)
  for i in range(len(x)):
    for j in range(degree + 1):
      y_pred[i] += coeffs[j] * (x[i] ** j)
  
  err = np.sum((y - y_pred) ** 2)
  return coeffs, err


def manual_polyval(coeffs, x):
  y = 0
  for power, coeff in enumerate(coeffs):
    y += coeff * (x ** power)
  return y


coeffs_deg1, sse_deg1 = fit_polynomial(x, y, degree=1)
coeffs_deg2, sse_deg2 = fit_polynomial(x, y, degree=2)

print("Коэффициенты многочлена 1-й степени:", coeffs_deg1)
print("Сумма квадратов ошибок (1-я степень):", sse_deg1)
print("Коэффициенты многочлена 2-й степени:", coeffs_deg2)
print("Сумма квадратов ошибок (2-я степень):", sse_deg2)

x_plot = np.linspace(min(x), max(x), 500)

y_deg1 = manual_polyval(coeffs_deg1, x_plot)
y_deg2 = manual_polyval(coeffs_deg2, x_plot)

plt.figure(figsize=(10, 6))
plt.plot(x, y, 'ro', label='Исходные данные')
plt.plot(x_plot, y_deg1, 'b-', label='МНК: степень 1')
plt.plot(x_plot, y_deg2, 'g--', label='МНК: степень 2')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Аппроксимация')
plt.legend()
plt.grid(True)
plt.show()
