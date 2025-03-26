#version 330 core

//----------------------------------------------------------------------------------

struct Material{
    float ambient;
    float diffuse;
    float specular;
    float shininess;
};

#define MAX_DIR_LIGHTS 16
struct DirLight {
    vec3 direction;
    vec3 color;

    float ambient;
    float diffuse;
    float specular;
};

#define MAX_POINT_LIGHTS 16
struct PointLight {
    vec3 position;
    vec3 color;

    float constant;
    float linear;
    float quadratic;

    float ambient;
    float diffuse;
    float specular;
};

#define MAX_SPOT_LIGHTS 16
struct SpotLight{
    vec3  position;
    vec3  direction;
    float cutOff;
    float outerCutOff;
    vec3 color;

    float ambient;
    float diffuse;
    float specular;

    float constant;
    float linear;
    float quadratic;
};

//----------------------------------------------------------------------------------

out vec4 FragColor;

in vec4 vertexColor;
in vec3 Normal;
in vec3 FragPos;

uniform vec3 viewPos;
uniform PointLight pointLights[MAX_POINT_LIGHTS];
uniform DirLight dirLights[MAX_DIR_LIGHTS];
uniform SpotLight spotLights[MAX_SPOT_LIGHTS];

uniform int numPointLights;
uniform int numDirLights;
uniform int numSpotLights;

uniform Material material;

//----------------------------------------------------------------------------------
vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir);
vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);
vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir);
//----------------------------------------------------------------------------------

void main()
{
    
    vec3 norm = normalize(Normal);
    vec3 viewDir = normalize(viewPos - FragPos);


    vec3 result = vec3(0, 0, 0);

    for(int i = 0; i < numDirLights; i++)
        result += CalcDirLight(dirLights[i], norm, viewDir);

    for(int i = 0; i < numPointLights; i++)
        result += CalcPointLight(pointLights[i], norm, FragPos, viewDir);

    for(int i = 0; i < numSpotLights; i++)
        result += CalcSpotLight(spotLights[i], norm, FragPos, viewDir);    

    FragColor = vec4(result, 1.0);
}

vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-light.direction);

    float diff = max(dot(normal, lightDir), 0.0);

    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);

    vec3 ambient  = light.ambient  * vertexColor.xyz * material.ambient;
    vec3 diffuse  = light.diffuse  * diff * vertexColor.xyz * light.color * material.diffuse;
    vec3 specular = light.specular * spec * vertexColor.xyz * light.color * material.specular;
    return (ambient + diffuse + specular);
}

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{
    vec3 lightDir = normalize(light.position - fragPos);

    float diff = max(dot(normal, lightDir), 0.0);

    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);

    float distance    = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance +
    light.quadratic * (distance * distance));

    vec3 ambient  = light.ambient  * vertexColor.xyz * material.ambient;
    vec3 diffuse  = light.diffuse  * diff * vertexColor.xyz * light.color * material.diffuse;
    vec3 specular = light.specular * spec * vertexColor.xyz * light.color * material.specular;
    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
} 
vec3 CalcSpotLight(SpotLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
{

    vec3 lightDir = normalize(light.position - FragPos);
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);

    float distance    = length(light.position - FragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance +
    light.quadratic * (distance * distance));

    float theta     = dot(lightDir, normalize(-light.direction));
    float epsilon   = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);

    vec3 ambient = light.ambient * vertexColor.xyz * material.ambient;
    vec3 diffuse = light.diffuse * diff * vertexColor.xyz * light.color * material.diffuse;
    vec3 specular = light.specular * spec * vertexColor.xyz * light.color * material.specular;
    ambient  *= attenuation;
    diffuse  *= attenuation * intensity;
    specular *= attenuation * intensity;
    return (ambient + diffuse + specular);
}