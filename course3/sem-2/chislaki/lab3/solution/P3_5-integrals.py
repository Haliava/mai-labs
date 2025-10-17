import numpy as np

def f(x):
    return 1 / np.sqrt((2 * x + 7) * (3 * x + 4))

def generate_points(a, b, h):
    points = []
    current = a
    while current < b:
        points.append(current)
        current += h
    points.append(b)
    return points

def rectangle(a, b, h):
    total = 0
    xs = generate_points(a, b, h)
    for i in range(1, len(xs)):
        mid = (xs[i - 1] + xs[i]) / 2
        total += h * f(mid)
    return total

def trapez(a, b, h):
    total = 0
    xs = generate_points(a, b, h)
    for i in range(1, len(xs)):
        total += 0.5 * h * (f(xs[i - 1]) + f(xs[i]))
    return total

def simpson(a, b, h):
    total = 0
    xs = generate_points(a, b, h)
    for i in range(1, len(xs)):
        left = xs[i - 1]
        right = xs[i]
        mid = (left + right) / 2
        total += (1/3) * (h / 2) * (f(left) + 4 * f(mid) + f(right))
    return total

def runge_romberg_error(results, steps, order):
    ratio = steps[0] / steps[1]
    return (results[1] - results[0]) / (ratio ** order - 1)

def runge_romberg_refinement(results, steps, order):
    return results[1] + runge_romberg_error(results, steps, order)

a, b = 0, 4
h1 = 1
h2 = 0.5
hs = [h1, h2]

methods = {
    'Прямоугольники': (rectangle, 2),
    'Трапеции': (trapez, 2),
    'Симпсон': (simpson, 4)
}

true_value = (2 / np.sqrt(6)) * np.log(
    (np.sqrt(2 * (3 * b + 4)) + np.sqrt(3 * (2 * b + 7))) /
    (np.sqrt(2 * (3 * a + 4)) + np.sqrt(3 * (2 * a + 7)))
)

print(f"Точное значение интеграла на [{a}, {b}]: {true_value:.8f}\n")

for name, (method, p) in methods.items():
    I_h1 = method(a, b, h1)
    I_h2 = method(a, b, h2)
    RR_error = runge_romberg_error([I_h1, I_h2], hs, p)
    RR_value = runge_romberg_refinement([I_h1, I_h2], hs, p)
    abs_error = abs(true_value - RR_value)
    print(f"{name}:")
    print(f"  I(h1={h1}) = {I_h1:.6f}")
    print(f"  I(h2={h2}) = {I_h2:.6f}")
    print(f"  Runge-Romberg уточнение = {RR_value:.6f}")
    print(f"  Погрешность RR ≈ {RR_error:.6f}")
    print(f"  Абсолютная погрешность ≈ {abs_error:.6f}\n")
