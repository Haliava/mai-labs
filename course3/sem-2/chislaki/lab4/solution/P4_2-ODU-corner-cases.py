import numpy as np
import matplotlib.pyplot as plt

def generate_points(a, b, h):
  points = []
  current = a
  while current < b:
    points.append(current)
    current += h
  points.append(b)
  return points

def runge_romberg(y_h, y_h2, p):
  return [abs(yh - yh2) / (2**p - 1) for yh, yh2 in zip(y_h, y_h2)]

# Правая часть уравнения: y'' = [4(x^2+3)y' - 6x y] / [x(x^2+6)]
def f(x, y1, y2):
  if abs(x) < 1e-12:
    return -y1
  return (4 * (x**2 + 3) * y2 - 6 * x * y1) / (x * (x**2 + 6))

def exact_solution(x):
  return x**3 + x**2 + 2

def runge_kutta_method(a, b, h, y1_0, y2_0):
  xs = generate_points(a, b, h)
  y1s = [y1_0]
  y2s = [y2_0]
  for i in range(1, len(xs)):
    x = xs[i - 1]
    y1 = y1s[-1]
    y2 = y2s[-1]

    k1 = h * y2
    l1 = h * f(x, y1, y2)

    k2 = h * (y2 + l1 / 2)
    l2 = h * f(x + h / 2, y1 + k1 / 2, y2 + l1 / 2)

    k3 = h * (y2 + l2 / 2)
    l3 = h * f(x + h / 2, y1 + k2 / 2, y2 + l2 / 2)

    k4 = h * (y2 + l3)
    l4 = h * f(x + h, y1 + k3, y2 + l3)

    y1_next = y1 + (k1 + 2 * k2 + 2 * k3 + k4) / 6
    y2_next = y2 + (l1 + 2 * l2 + 2 * l3 + l4) / 6

    y1s.append(y1_next)
    y2s.append(y2_next)

  return xs, y1s, y2s


def shooting_method(h, beta, a=0, b=4):
  def phi(s):
    xs, y1s, y2s = runge_kutta_method(a, b, h, y1_0=s, y2_0=0.0)
    y_b = y1s[-1]
    y_prime_b = y2s[-1]
    return y_b - y_prime_b - beta

  s0, s1 = 0.0, 5.0
  for iter_count in range(20):
    f0, f1 = phi(s0), phi(s1)
    if abs(f1) < 1e-12:
      break
    s2 = s1 - f1 * (s1 - s0) / (f1 - f0)
    s0, s1 = s1, s2

  xs, y1s, y2s = runge_kutta_method(a, b, h, y1_0=s1, y2_0=0.0)
  return iter_count, xs, y1s, s1

h1 = 0.1
h2 = h1 / 2

iter1, x1, y1, s1 = shooting_method(h1, beta=26)
iter2, x2, y2, s2 = shooting_method(h2, beta=26)

y2_on_h1_grid = [y2[i] for i in range(0, len(y2), 2)]
rr_error = runge_romberg(y1, y2_on_h1_grid, p=4)

x_exact = np.linspace(0, 4, 200)
y_exact = exact_solution(x_exact)

plt.figure(figsize=(10, 6))
plt.plot(x2[:-1], y2[:-1], 'o-', label='Метод стрельбы (h=0.05)', markersize=4)
plt.plot(x_exact, y_exact, '--', label='Точное решение', linewidth=2)
plt.xlabel('x')
plt.ylabel('y(x)')
plt.title('метод стрельбы')
plt.grid(True)
plt.legend()
plt.show()

print("Сравнение решений на сетке h=0.1:")
for i in range(len(x1)):
  x_val = x1[i]
  y_num = y1[i]
  y_true = exact_solution(x_val)
  abs_err = abs(y_true - y_num)
  rr_est = rr_error[i] if i < len(rr_error) else float('nan')
  print(f"x = {x_val:4.1f} | y_точн = {y_true:8.5f} | y_числ = {y_num:8.5f} | "
      f"абс. ош. = {abs_err:.2e} | Р-Р ош. = {rr_est:.2e}")
