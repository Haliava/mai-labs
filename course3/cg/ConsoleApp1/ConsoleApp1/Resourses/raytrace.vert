#version 330 core

// ������������ ���������� ����������
#define MAX_PLANES 10

// ��������� ��� �������� ���������
struct Plane {
    vec3 position;
    vec3 normal;
    vec4 color;
    float ambient;
    float diffuse;
    float specular;
    float shininess;
};

// ������ ����������
uniform Plane planes[MAX_PLANES];

// ������� �������������
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

// �������� ������� ������
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec4 aColor;

// �������� ������
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
