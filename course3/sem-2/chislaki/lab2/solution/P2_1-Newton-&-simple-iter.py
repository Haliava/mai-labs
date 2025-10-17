import math
from scipy.optimize import root_scalar
import matplotlib.pyplot as plt

def f(x): return math.log(x + 2) - x ** 4 + 0.5
def df_dx(x): return 1 / (x + 2) - 4 * x ** 3
def d2f_dx(x): return -1 / ((x + 2) ** 2) - 12 * x ** 2
def phi(x): return (math.log(x + 2) + 0.5) ** (1 / 4)

def solve_newton(x0, eps, max_iter=20):
  if (f(x0) * d2f_dx(x0) <= 0):
    raise Exception("Последовательность может не сойтись")

  xPrev = x0
  history = [xPrev]
  iterations = 0
  for _ in range(max_iter):
    iterations += 1
    xCur = xPrev - f(xPrev) / df_dx(xPrev)
    history.append(xCur)
    if abs(xCur - xPrev) < eps:
      break
    xPrev = xCur
  return xCur, iterations, history


def solve_simple_iterations(x0, q, eps):
  xPrev = x0
  iterations = 0
  while (True):
    iterations += 1
    xCur = phi(xPrev)
    error = q / (1 - q) * abs(xCur - xPrev)
    if error < eps:
      break
    xPrev = xCur
  return xCur, iterations


eps = 1e-10
x0 = 1.15

newton_res, iterations = solve_newton(x0, eps)
print("Метод Ньютона")
print("\tКорень: ", newton_res)
print("\tКоличество итераций: ", iterations)

history_full = solve_newton(1.2, eps=1e-30, max_iter=30)
x_true = history_full[-1] 

history = solve_newton(1.2, eps=1e-10)
errors = [abs(x - x_true) for x in history]

plt.figure(figsize=(8, 5))
plt.semilogy(range(1, len(errors) + 1), errors, 'o-', label='Погрешность')
plt.xlabel('Итерация')
plt.ylabel('Погрешность')
plt.title('Сходимость метода Ньютона')
plt.grid(True, which="both", ls="--")
plt.legend()
plt.show()

x_one = 1
q = 0.25 / ((x_one + 2) * ((math.log(x_one + 2) + 0.5) ** (3 / 4)))
simpleIterationsAns, iterations = solve_simple_iterations(x0, q, eps)
print("Метода простых итераций")
print("\tКорень: ", simpleIterationsAns)
print("\tКоличество итераций: ", iterations)

sol = (root_scalar(f, bracket=[1.1, 1.2], method='brentq', xtol=eps)).root
print("Библиотечный метод:")
print(f"\tКорень: {sol:.12f}")
