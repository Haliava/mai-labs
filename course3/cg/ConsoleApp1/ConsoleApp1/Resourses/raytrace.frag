#version 450 core

out vec4 FragColor;

uniform vec3 cameraPosition; // ��������� ������
uniform vec3 lightPosition;  // ��������� ��������� �����
uniform vec3 lightColor;     // ���� �����
uniform vec3 fogColor;       // ���� ������
uniform float fogDensity;    // ��������� ������

uniform vec3 spheres[2];     // ������� ���� (�� 2 ���� � ������ �������)
uniform float sphereRadii[2]; // ������� ����

uniform vec3 planeNormal;    // ������� � ���������
uniform vec3 planePoint;     // ����� �� ���������

const int MAX_BOUNCES = 4;   // ������������ ���������� ���������
const float EPSILON = 0.001; // ��������� ��������� ��� ��������

// ������� ��� ����������� ���� �� ������
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

// ������� ��� ����������� ���� � ����������
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

// �������� ����� ������� ����� ��� ����������� �����
vec3 RayTrace(vec3 rayOrigin, vec3 rayDir)
{
    vec3 color = vec3(0.0); // ��������� ���� (������)
    vec3 attenuation = vec3(1.0); // ��������� �����
    float closestT = 1e6;
    vec3 hitNormal;

    // �������� ����������� �� �������
    for (int i = 0; i < 2; ++i)
    {
        float t;
        if (RayIntersectSphere(rayOrigin, rayDir, spheres[i], sphereRadii[i], t) && t < closestT)
        {
            closestT = t;
            vec3 hitPoint = rayOrigin + t * rayDir;
            hitNormal = normalize(hitPoint - spheres[i]);
            color = lightColor; // ������ ������� ����
        }
    }

    // �������� ����������� � ����������
    float tPlane;
    if (RayIntersectPlane(rayOrigin, rayDir, planePoint, planeNormal, tPlane) && tPlane < closestT)
    {
        closestT = tPlane;
        hitNormal = planeNormal;
        color = vec3(0.5, 0.5, 0.5); // ���� ���������
    }

    // ���������� ������� ������
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
    vec3 rayDir = normalize(vec3(gl_FragCoord.xy, -1.0) - cameraPosition); // ��������� ����������� ����
    vec3 color = RayTrace(rayOrigin, rayDir);
    FragColor = vec4(color, 1.0);
}
