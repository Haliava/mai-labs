using OpenTK.Windowing.Desktop;
using OpenTK.Windowing.Common;
using OpenTK.Windowing.GraphicsLibraryFramework;
using OpenTK.Graphics.OpenGL;
using System;
using System.Numerics;

namespace ShaderExample
{
    public class ShaderWindow : GameWindow
    {
        private int shaderProgram;
        private int vertexShader;
        private int fragmentShader;
        private float startTime;
        private Vector2 mousePosition = new Vector2(0.0f, 0.0f);
        private int iTimeLocation;
        private int iMouseLocation;
        private int iResolutionLocation;

        public ShaderWindow(int width, int height, string title) : base(GameWindowSettings.Default, new NativeWindowSettings
        {
            Title = title,
            APIVersion = new Version(4, 1),
            Flags = ContextFlags.ForwardCompatible,
            Profile = ContextProfile.Core
        })
        {
            startTime = (float)(DateTime.Now.Ticks / TimeSpan.TicksPerSecond);
            Load += OnLoad;
            UpdateFrame += OnUpdateFrame;
            RenderFrame += OnRenderFrame;
            MouseMove += OnMouseMove;
        }

        private void OnLoad(object sender, EventArgs e)
        {
            string vertexShaderSource = @"
                #version 410 core
                out vec2 TexCoord;
                void main()
                {
                    const vec2 vertices[4] = vec2[4](
                        vec2(-1.0, -1.0),
                        vec2(1.0, -1.0),
                        vec2(-1.0, 1.0),
                        vec2(1.0, 1.0)
                    );
                    gl_Position = vec4(vertices[gl_VertexID], 0.0, 1.0);
                    TexCoord = (gl_Position.xy + 1.0) / 2.0;
                }";

            string fragmentShaderSource = @"
                #version 410 core
                uniform float iTime;
                uniform vec2 iMouse;
                uniform vec2 iResolution;
                in vec2 TexCoord;
                out vec4 fragColor;

                // Graphics settings
                #define AVERAGECOUNT 16
                #define MAX_BOUNCE 32

                // Scene data
                #define SPHERECOUNT 6
                const vec4 AllSpheres[SPHERECOUNT] = vec4[SPHERECOUNT](
                    vec4(0.0, 0.0, 0.0, 2.0), // sphere A
                    vec4(0.0, 0.0, -1.0, 2.0), // sphere B
                    vec4(0.0, -1002.0, 0.0, 1000.0), // ground
                    vec4(0.0, 0.0, +1002.0, 1000.0), // back wall
                    vec4(-1004.0, 0.0, 0.0, 1000.0), // left wall
                    vec4(+1004.0, 0.0, 0.0, 1000.0) // right wall
                );

                float raySphereIntersect(vec3 r0, vec3 rd, vec3 s0, float sr)
                {
                    float a = dot(rd, rd);
                    vec3 s0_r0 = r0 - s0;
                    float b = 2.0 * dot(rd, s0_r0);
                    float c = dot(s0_r0, s0_r0) - (sr * sr);
                    if (b * b - 4.0 * a * c < 0.0)
                    {
                        return -1.0;
                    }
                    return (-b - sqrt((b * b) - 4.0 * a * c)) / (2.0 * a);
                }

                struct HitData
                {
                    float rayLength;
                    vec3 normal;
                };

                HitData AllObjectsRayTest(vec3 rayPos, vec3 rayDir)
                {
                    HitData hitData;
                    hitData.rayLength = 9999.0;

                    for (int i = 0; i < SPHERECOUNT; i++)
                    {
                        vec3 sphereCenter = AllSpheres[i].xyz;
                        float sphereRadius = AllSpheres[i].w;

                        if (i == 0)
                        {
                            float t = fract(iTime * 0.7);
                            t = -4.0 * t * t + 4.0 * t;
                            sphereCenter.y += t * 0.7;
                            sphereCenter.x += sin(iTime) * 2.0;
                            sphereCenter.z += cos(iTime) * 2.0;
                        }

                        if (i == 1)
                        {
                            float t = fract(iTime * 0.47);
                            t = -4.0 * t * t + 4.0 * t;
                            sphereCenter.y += t * 1.7;
                            sphereCenter.x += sin(iTime + 3.14) * 2.0;
                            sphereCenter.z += cos(iTime + 3.14) * 2.0;
                        }

                        float resultRayLength = raySphereIntersect(rayPos, rayDir, sphereCenter, sphereRadius);
                        if (resultRayLength < hitData.rayLength && resultRayLength > 0.001)
                        {
                            hitData.rayLength = resultRayLength;
                            vec3 hitPos = rayPos + rayDir * resultRayLength;
                            hitData.normal = normalize(hitPos - sphereCenter);
                        }
                    }

                    return hitData;
                }

                float rand01(float seed)
                {
                    return fract(sin(seed) * 43758.5453123);
                }

                vec3 randomInsideUnitSphere(vec3 rayDir, vec3 rayPos, float extraSeed)
                {
                    float seed = dot(rayDir, rayPos) + extraSeed;
                    return vec3(rand01(seed + 0.357),
                                rand01(seed + 16.35647),
                                rand01(seed + 425.357));
                }

                vec4 calculateFinalColor(vec3 cameraPos, vec3 cameraRayDir, float AAIndex)
                {
                    vec3 finalColor = vec3(0.0);
                    float absorbMul = 1.0;
                    vec3 rayStartPos = cameraPos;
                    vec3 rayDir = cameraRayDir;

                    float firstHitRayLength = -1.0;

                    for (int i = 0; i < MAX_BOUNCE; i++)
                    {
                        HitData h = AllObjectsRayTest(rayStartPos + rayDir * 0.0001, rayDir);

                        firstHitRayLength = firstHitRayLength < 0.0 ? h.rayLength : firstHitRayLength;

                        if (h.rayLength >= 9900.0)
                        {
                            vec3 skyColor = vec3(0.7, 0.85, 1.0);
                            finalColor = skyColor * absorbMul;
                            break;
                        }

                        absorbMul *= 0.8;

                        rayStartPos = rayStartPos + rayDir * h.rayLength;
                        float roughness = 0.05 + iMouse.x / iResolution.x;
                        rayDir = normalize(reflect(rayDir, h.normal) + randomInsideUnitSphere(rayDir, rayStartPos, AAIndex) * roughness);
                    }

                    return vec4(finalColor, firstHitRayLength);
                }

                void main()
                {
                    vec2 uv = TexCoord;
                    uv = uv * 2.0 - 1.0;
                    uv.x *= iResolution.x / iResolution.y;

                    vec3 cameraPos = vec3(sin(iTime * 0.47) * 4.0, sin(iTime * 0.7) * 8.0 + 6.0, -25.0);
                    vec3 cameraFocusPoint = vec3(0, 0.0 + sin(iTime), 0);
                    vec3 cameraDir = normalize(cameraFocusPoint - cameraPos);

                    float fovTempMul = 0.2 + sin(iTime * 0.4) * 0.05;
                    vec3 rayDir = normalize(cameraDir + vec3(uv, 0) * fovTempMul);

                    vec4 finalColor = vec4(0);
                    for (int i = 1; i <= AVERAGECOUNT; i++)
                    {
                        finalColor += calculateFinalColor(cameraPos, rayDir, float(i));
                    }
                    finalColor = finalColor / float(AVERAGECOUNT);
                    finalColor.rgb = pow(finalColor.rgb, vec3(1.0 / 2.2));

                    float z = finalColor.w;
                    float cineShaderZ = pow(clamp(1.0 - max(0.0, z - 21.0) * (1.0 / 6.0), 0.0, 1.0), 2.0);

                    fragColor = vec4(finalColor.rgb, cineShaderZ);
                }";

            vertexShader = LoadShader(ShaderType.VertexShader, vertexShaderSource);
            fragmentShader = LoadShader(ShaderType.FragmentShader, fragmentShaderSource);
            shaderProgram = LinkShaderProgram();
            SetupUniforms();
        }

        private int LoadShader(ShaderType type, string source)
        {
            int shader = GL.CreateShader(type);
            GL.ShaderSource(shader, source);
            GL.CompileShader(shader);
            int compiled;
            GL.GetShader(shader, ShaderParameter.CompileStatus, out compiled);
            if (compiled != 1)
            {
                string infoLog = GL.GetShaderInfoLog(shader);
                throw new Exception("Shader compilation failed: " + infoLog);
            }
            return shader;
        }

        private int LinkShaderProgram()
        {
            int program = GL.CreateProgram();
            GL.AttachShader(program, vertexShader);
            GL.AttachShader(program, fragmentShader);
            GL.LinkProgram(program);
            int linked;
            GL.GetProgram(program, GetProgramParameterName.LinkStatus, out linked);
            if (linked != 1)
            {
                string infoLog = GL.GetProgramInfoLog(program);
                throw new Exception("Shader linking failed: " + infoLog);
            }
            return program;
        }

        private void SetupUniforms()
        {
            iTimeLocation = GL.GetUniformLocation(shaderProgram, "iTime");
            iMouseLocation = GL.GetUniformLocation(shaderProgram, "iMouse");
            iResolutionLocation = GL.GetUniformLocation(shaderProgram, "iResolution");
        }

        private void OnUpdateFrame(object sender, FrameEventArgs e)
        {
            // Update mouse position and other variables if needed
        }

        private void OnRenderFrame(object sender, FrameEventArgs e)
        {
            float currentTime = (float)(DateTime.Now.Ticks / TimeSpan.TicksPerSecond);
            float deltaTime = currentTime - startTime;

            GL.Clear(ClearBufferMask.ColorBufferBit);
            GL.UseProgram(shaderProgram);

            GL.Uniform1(iTimeLocation, deltaTime);
            GL.Uniform2(iMouseLocation, mousePosition.X, mousePosition.Y);
            GL.Uniform2(iResolutionLocation, 600f, 600f);

            GL.DrawArrays(PrimitiveType.TriangleStrip, 0, 4);

            SwapBuffers();
        }

        private void OnMouseMove(object sender, MouseMoveEventArgs e)
        {
            mousePosition = new Vector2(e.X, e.Y);
        }

        static void Main(string[] args)
        {
            using (var window = new ShaderWindow(800, 600, "Shader Example"))
            {
                window.Run();
            }
        }
    }
}