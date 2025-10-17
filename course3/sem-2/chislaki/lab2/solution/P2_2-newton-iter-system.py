import numpy as np
from chislaki.lab1.solution import solve_lu, lu
import matplotlib.pyplot as plt

def f(x):
  return np.array([
    2 * x[0]**2 - x[0] + x[1]**2 - 1,
    x[1] - np.tan(x[0])
  ])
def df_dx(x):
  cos_x1 = np.cos(x[0])
  sec2_x1 = 1.0 / (cos_x1 ** 2)
  return np.array([
    [4 * x[0] - 1, 2 * x[1]],
    [-sec2_x1, 1]
  ])


def newton_with_history(x0, eps):
  xPrev = x0
  iterations = 0
  history = [xPrev.copy()]
  while True:
    iterations += 1
    P, L, U, _ = lu(df_dx(xPrev))
    xDelta = solve_lu(P, L, U, -f(xPrev))
    xCur = xPrev + xDelta
    history.append(xCur.copy())
    if np.max(np.abs(xCur - xPrev)) < eps:
      break
    xPrev = xCur
    if iterations > 50:
      break
  return xCur, iterations, history

def solve_simple_iterations(x0, eps, lam=0.08):
  def phi(x):
    return x - lam * f(x)
  
  xPrev = x0.copy()
  iterations = 0
  while True:
    iterations += 1
    xCur = phi(xPrev)
    if np.max(np.abs(xCur - xPrev)) < eps:
      break
    xPrev = xCur
    if iterations > 10000:
      raise RuntimeError("Простые итерации не сошлись")
  return xCur, iterations


eps = 1e-10
x0 = np.array([0.5, 0.5])
exact_solution, _, _ = newton_with_history(x0, eps)
eps_plot = 1e-6
_, _, newton_history = newton_with_history(x0, eps_plot)

newton_errors = []
for x in newton_history:
    err = np.linalg.norm(x - exact_solution, ord=np.inf)
    newton_errors.append(err)

plt.semilogy(range(len(newton_errors)), newton_errors, 'bo-', label='Метод Ньютона')
plt.xlabel('Номер итерации')
plt.ylabel('Погрешность (||x_k - x*||_∞)')
plt.title('Зависимость погрешности от количества итераций (Метод Ньютона)')
plt.grid(True, which="both", ls="-")
plt.legend()
plt.show()

newtonAns, iterations, _ = newton_with_history(x0, eps)
print("Метод Ньютона")
print("\tКорень: ", newtonAns)
print("\tКоличество итераций: ", iterations)

simpleIterationsAns, iterations = solve_simple_iterations(x0, 1e-6, lam=0.08)
print("Метода простых итераций")
print("\tКорень: ", simpleIterationsAns)
print("\tКоличество итераций: ", iterations)
