#include <iostream>
#include <cmath>
#include <iomanip>

struct EquationSolution {
  enum AnswerCount { NONE, IMAGINARY, ONE, TWO, ALL } answerCount;
  double solutions[2];
};

EquationSolution solve_eq(double a, double b, double c) {
  if (a == 0) {
    if (b == 0) {
      if (c == 0) return EquationSolution{EquationSolution::ALL, {0, 0}};
      return EquationSolution{EquationSolution::NONE, {0, 0}};
    }

    return EquationSolution{EquationSolution::ONE, {-c / b, 0}};
  }

  double D = b * b - 4 * a * c;
  if (D < 0) return EquationSolution{EquationSolution::IMAGINARY, {0, 0}};
  if (D == 0) return EquationSolution{EquationSolution::ONE, {-b / (2 * a), 0}};
  else return EquationSolution{EquationSolution::TWO, {(-b + sqrt(D)) / (2 * a), (-b - sqrt(D)) / (2 * a)}};
}

int main() {
  double a, b, c;
  std::cin >> a >> b >> c;

  EquationSolution answer = solve_eq(a, b, c);

  switch (answer.answerCount) {
    case EquationSolution::NONE:
      std::cout << "incorrect\n";
      break;
    case EquationSolution::IMAGINARY:
      std::cout << "imaginary\n";
      break;
    case EquationSolution::ONE:
      printf("%.6f\n", answer.solutions[0]);
      break;
    case EquationSolution::TWO:
      printf("%.6f %.6f\n", answer.solutions[0], answer.solutions[1]);
      break;
    case EquationSolution::ALL:
      std::cout << "any\n";
      break;
  }

  return 0;
}
