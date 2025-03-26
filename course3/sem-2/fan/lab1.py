import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import lagrange

k = 9
l = 5

def define_T():
  def T(x):
    def inner(t):
      if t <= 5 / 12:
        scaled_t = 12 * t / 5
        return 1 / (1 + k * x(scaled_t)) - l / 2
      elif t >= 7 / 12:
        scaled_t = (12 * t - 7) / 5
        return 1 / (1 + k * x(scaled_t)) + l / 2
      else:
        t1, t2, t3 = 5 / 12, 0.5, 7 / 12

        y1 = 1 / (1 + k * x(12 * (5 / 12) / 5)) - l / 2  # t = 5 / 12
        y2 = 1  # T(x)(1/2) = 1
        y3 = 1 / (1 + k * x((12 * (7 / 12) - 7)/5) ) + l / 2  # t = 7 / 12
        
        points = np.array([t1, t2, t3])
        values = np.array([y1, y2, y3])
        poly = lagrange(points, values)
        return poly(t)
    return inner
  return T

def find_fixed_point(T, x0, epsilon=0.001, max_iter=1000):
  x_prev = x0
  history = []
  for n in range(max_iter):
    x_next = T(x_prev)

    t_samples = np.linspace(0, 1, 1000)
    diff = np.max(np.abs([x_next(t) - x_prev(t) for t in t_samples]))
    history.append((n, x_next, diff))
    
    if diff < epsilon:
      break
    x_prev = x_next
  return x_next, history


x0 = lambda _: 0

T = define_T()
x_fixed, history = find_fixed_point(T, x0, epsilon=0.001)

plt.figure(figsize=(12, 6))
t_plot = np.linspace(0, 1, 1000)

plt.plot(t_plot, [x_fixed(t) for t in t_plot], 'r-', lw=2, label=f'(ε=0.001)')

for n, x, diff in history[:3]:
    plt.plot(t_plot, [x(t) for t in t_plot], '--', label=f'итерация {n+1}')

plt.xlabel('t')
plt.ylabel('x(t)')
plt.legend()
plt.grid(True)
plt.show()