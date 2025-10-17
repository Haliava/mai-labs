import numpy as np
import matplotlib.pyplot as plt

# x(x^2 + 6)y'' - 4(x^2 + 3)y' + 6xy = 0
# y'(0)=0
# y(4) - y'(4) = 26
# Точное решение: y(x) = x^3 + x^2 + 2

def generate_points(a, b, h):
    points = []
    current = a
    while current < b:
        points.append(current)
        current += h
    points.append(b)
    return points

def exact_solution(x):
    return x**3 + x**2 + 2

# y'' + p(x)y' + q(x)y = f(x)
# => y'' - [4(x^2+3)/(x(x^2+6))]y' + [6x/(x(x^2+6))]y = 0
def p(x):
    return -4 * (x**2 + 3) / (x * (x**2 + 6)) if x != 0 else 0

def q(x):
    return 6 / (x**2 + 6)

def f(x):
    return 0

def progonka(A, b):
    n = len(b)
    P = np.zeros(n)
    Q = np.zeros(n)
    P[0] = -A[0][2] / A[0][1]
    Q[0] = b[0] / A[0][1]
    for i in range(1, n):
        denom = A[i][1] + A[i][0] * P[i - 1]
        P[i] = -A[i][2] / denom
        Q[i] = (b[i] - A[i][0] * Q[i - 1]) / denom
    x = np.zeros(n)
    x[-1] = Q[-1]
    for i in range(n - 2, -1, -1):
        x[i] = P[i] * x[i + 1] + Q[i]
    return x

def finite_difference(a, b, h):
    xs = generate_points(a, b, h)
    n = len(xs)
    A = np.zeros((n, 3))  # [a_i, b_i, c_i]
    rhs = np.zeros(n)

    # Левая граница: y'(0)=0 → (y1 - y0)/h = 0 → y1 = y0
    A[0][1] = -1
    A[0][2] = 1
    rhs[0] = 0

    # Правая граница: y(4) - y'(4) = 26 → y_n - (y_n - y_{n-1})/h = 26
    A[-1][0] = -1 / h
    A[-1][1] = 1 + 1 / h
    rhs[-1] = 26

    # Внутренние узлы
    for i in range(1, n - 1):
        xi = xs[i]
        A[i][0] = 1 / h**2 - p(xi) / (2 * h)
        A[i][1] = -2 / h**2 + q(xi)
        A[i][2] = 1 / h**2 + p(xi) / (2 * h)
        rhs[i] = f(xi)

    ys = progonka(A, rhs)
    return xs, ys

def runge_romberg(yh, yh2, p):
    return [abs(a - b) / (2**p - 1) for a, b in zip(yh, yh2)]

h1 = 0.2
h2 = 0.1

x1, y1 = finite_difference(0, 4, h1)
x2, y2 = finite_difference(0, 4, h2)

y_exact = [exact_solution(x) for x in x2]

rr_error = runge_romberg(y1, y2[::2], 2)
abs_error = [abs(a - b) for a, b in zip(y2, y_exact)]

for i in range(len(x1)):
    print(f"x = {x1[i]:.2f},  y_diff = {y1[i]:.6f},  y_exact = {exact_solution(x1[i]):.6f},  abs_error = {abs(exact_solution(x1[i]) - y1[i]):.3e}")

plt.plot(x2, y2, 'o-', label='Численное решение (h=0.1)')
plt.plot(x2, y_exact, '--', label='Точное решение')
plt.title("Решение краевой задачи методом конечных разностей")
plt.xlabel("x")
plt.ylabel("y(x)")
plt.legend()
plt.grid()
plt.show()
