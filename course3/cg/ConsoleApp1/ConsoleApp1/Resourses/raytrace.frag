#version 450 core

out vec4 FragColor;

uniform vec3 cameraPosition; // Положение камеры
uniform vec3 lightPosition;  // Положение источника света
uniform vec3 lightColor;     // Цвет света
uniform vec3 fogColor;       // Цвет тумана
uniform float fogDensity;    // Плотность тумана

uniform vec3 spheres[2];     // Позиции сфер (до 2 сфер в данном примере)
uniform float sphereRadii[2]; // Радиусы сфер

uniform vec3 planeNormal;    // Нормаль к плоскости
uniform vec3 planePoint;     // Точка на плоскости

const int MAX_BOUNCES = 4;   // Максимальное количество отражений
const float EPSILON = 0.001; // Маленькая константа для точности

// Функция для пересечения луча со сферой
bool RayIntersectSphere(vec3 rayOrigin, vec3 rayDir, vec3 sphereCenter, float sphereRadius, out float t)
{
    vec3 oc = rayOrigin - sphereCenter;
    float a = dot(rayDir, rayDir);
    float b = 2.0 * dot(oc, rayDir);
    float c = dot(oc, oc) - sphereRadius * sphereRadius;
    float discriminant = b * b - 4.0 * a * c;
    if (discriminant < 0.0)
    {
        return false;
    }
    else
    {
        t = (-b - sqrt(discriminant)) / (2.0 * a);
        if (t < 0.0) t = (-b + sqrt(discriminant)) / (2.0 * a);
        return t > 0.0;
    }
}

// Функция для пересечения луча с плоскостью
bool RayIntersectPlane(vec3 rayOrigin, vec3 rayDir, vec3 planePoint, vec3 planeNormal, out float t)
{
    float denom = dot(planeNormal, rayDir);
    if (abs(denom) > EPSILON)
    {
        t = dot(planePoint - rayOrigin, planeNormal) / denom;
        return t >= 0.0;
    }
    return false;
}

// Основной метод расчета цвета для трассировки лучей
vec3 RayTrace(vec3 rayOrigin, vec3 rayDir)
{
    vec3 color = vec3(0.0); // Начальный цвет (черный)
    vec3 attenuation = vec3(1.0); // Затухание цвета
    float closestT = 1e6;
    vec3 hitNormal;

    // Проверка пересечений со сферами
    for (int i = 0; i < 2; ++i)
    {
        float t;
        if (RayIntersectSphere(rayOrigin, rayDir, spheres[i], sphereRadii[i], t) && t < closestT)
        {
            closestT = t;
            vec3 hitPoint = rayOrigin + t * rayDir;
            hitNormal = normalize(hitPoint - spheres[i]);
            color = lightColor; // Задаем базовый цвет
        }
    }

    // Проверка пересечения с плоскостью
    float tPlane;
    if (RayIntersectPlane(rayOrigin, rayDir, planePoint, planeNormal, tPlane) && tPlane < closestT)
    {
        closestT = tPlane;
        hitNormal = planeNormal;
        color = vec3(0.5, 0.5, 0.5); // Цвет плоскости
    }

    // Добавление эффекта тумана
    if (closestT < 1e6)
    {
        float distance = closestT;
        float fogFactor = 1.0 - exp(-fogDensity * distance * distance);
        color = mix(color, fogColor, fogFactor);
    }

    return color;
}

void main()
{
    vec3 rayOrigin = cameraPosition;
    vec3 rayDir = normalize(vec3(gl_FragCoord.xy, -1.0) - cameraPosition); // Генерация направления луча
    vec3 color = RayTrace(rayOrigin, rayDir);
    FragColor = vec4(color, 1.0);
}
