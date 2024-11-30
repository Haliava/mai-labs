#version 330 core

// Максимальное количество плоскостей
#define MAX_PLANES 10

// Структура для описания плоскости
struct Plane {
    vec3 position;
    vec3 normal;
    vec4 color;
    float ambient;
    float diffuse;
    float specular;
    float shininess;
};

// Массив плоскостей
uniform Plane planes[MAX_PLANES];

// Матрицы трансформации
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

// Атрибуты входных данных
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec4 aColor;

// Выходные данные
out vec3 FragPos;
out vec3 Normal;
out vec4 Color;

void main()
{
    FragPos = vec3(model * vec4(aPos, 1.0));
    Normal = mat3(transpose(inverse(model))) * aNormal;
    Color = aColor;

    gl_Position = projection * view * vec4(FragPos, 1.0);
}
