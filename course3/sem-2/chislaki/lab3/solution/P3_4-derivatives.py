import numpy as np
import matplotlib.pyplot as plt


def lagrange_interpolation(x, xi, yi):
  n = len(xi)
  Lx = 0
  for i in range(n):
    li = 1
    for j in range(n):
      if i != j:
        li *= (x - xi[j]) / (xi[i] - xi[j])
    Lx += yi[i] * li
  return Lx


x = np.array([1, 1.5, 2.0, 2.5, 3.0])
y = np.array([2, 2.1667, 2.5, 2.9, 3.3333])

i = 2
x_star = 2.0

def get_index(x_star, x):
  for i in range(len(x) - 2):
    if x[i] <= x_star <= x[i + 1]:
      return i

i = get_index(x_star, x)

dy1 = (y[i + 1] - y[i]) / (x[i + 1] - x[i])
dy2 = (y[i + 2] - y[i + 1]) / (x[i + 2] - x[i + 1])
correction = (dy2 - dy1) / (x[i + 2] - x[i]) * (2 * x_star - x[i] - x[i + 1])

first_derivative = dy1 + correction
second_derivative = 2 * (dy2 - dy1) / (x[i + 1] - x[i - 1])

print(f"Первая производная в x* = {x_star}: {first_derivative:.6f}")
print(f"Вторая производная в x* = {x_star}: {second_derivative:.6f}")

tan = lambda x_star: (lagrange_interpolation(x_star + 1e-3, x, y) - lagrange_interpolation(x_star, x, y)) / 1e-3
print(f"Первая производная по функции интерполяции = {tan(x_star)}")

x_vals = np.linspace(0.9, 3.1, 500)
tangent_line = tan(x_star)*(x_vals-x_star) + lagrange_interpolation(x_star, x, y)

lagrange_vals = [lagrange_interpolation(point, x, y) for point in x_vals]

plt.figure(figsize=(10, 10))
plt.plot(x_vals, lagrange_vals, label='Интерполяция Лагранжа', linestyle='--', color='blue')
plt.scatter(x, y, color='red', label='Узлы интерполяции', zorder=5)
plt.plot(x_vals, tangent_line, '--', label='Касательная в x*', color='red')

plt.title('Интерполяция по точкам')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.axis('square')
plt.show()
