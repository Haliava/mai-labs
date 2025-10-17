import numpy as np
import matplotlib.pyplot as plt

xi = np.array([0.1, 0.5, 1.1, 1.3])

yi = 1 / xi
x_star = 0.8
f_real = 1 / x_star

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


def newton_coefficients(xi, yi):
    n = len(xi)
    coef = np.copy(yi)
    for j in range(1, n):
        coef[j:n] = (coef[j:n] - coef[j - 1:n - 1]) / (xi[j:n] - xi[0:n - j])
    return coef

def newton_interpolation(x, xi, coef):
    n = len(coef)
    Nx = coef[0]
    mult_term = 1.0
    for i in range(1, n):
        mult_term *= (x - xi[i - 1])
        Nx += coef[i] * mult_term
    return Nx

lagrange_result = lagrange_interpolation(x_star, xi, yi)
newton_coef = newton_coefficients(xi, yi)
newton_result = newton_interpolation(x_star, xi, newton_coef)

lagrange_error = abs(f_real - lagrange_result)
newton_error = abs(f_real - newton_result)

print(f"Точное значение f({x_star}) = {f_real}")
print(f"Интерполяция Лагранжа: {lagrange_result}, погрешность: {lagrange_error}")
print(f"Интерполяция Ньютона: {newton_result}, погрешность: {newton_error}")


x_vals = np.linspace(0.1, 1.3, 500)
f_vals = 1 / x_vals
lagrange_vals = [lagrange_interpolation(x, xi, yi) for x in x_vals]
newton_vals = [newton_interpolation(x, xi, newton_coef) for x in x_vals]

plt.figure(figsize=(10, 6))
plt.plot(x_vals, f_vals, label='Исходная функция f(x) = 1/x', color='black', linewidth=2)
plt.plot(x_vals, lagrange_vals, label='Интерполяция Лагранжа', linestyle='--', color='blue')
plt.plot(x_vals, newton_vals, label='Интерполяция Ньютона', linestyle='-.', color='green')
plt.scatter(xi, yi, color='red', label='Узлы интерполяции', zorder=5)
plt.axvline(x_star, color='gray', linestyle=':', label=f'x* = {x_star}')

plt.title('Интерполяция функции f(x) = 1/x')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
plt.savefig("interpolation_plot_b.png")
