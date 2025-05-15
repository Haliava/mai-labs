using System;
using OpenTK;
using OpenTK.Graphics.OpenGL;
using OpenTK.Input;
using OpenTK.Windowing.Common;
using OpenTK.Windowing.Desktop;

namespace FlatShadingExample
{
    public class Game : GameWindow
    {
        private int _vertexBufferObject;
        private int _vertexArrayObject;
        private int _elementBufferObject;
        private int _shaderProgram;

        private float[] _vertices =
        {
            // Positions          // Normals
            -1.0f, -1.0f, -1.0f, 0.0f, 0.0f, -1.0f,
             1.0f, -1.0f, -1.0f, 0.0f, 0.0f, -1.0f,
             1.0f,  1.0f, -1.0f, 0.0f, 0.0f, -1.0f,
            -1.0f,  1.0f, -1.0f, 0.0f, 0.0f, -1.0f,
            -1.0f, -1.0f,  1.0f, 0.0f, 0.0f,  1.0f,
             1.0f, -1.0f,  1.0f, 0.0f, 0.0f,  1.0f,
             1.0f,  1.0f,  1.0f, 0.0f, 0.0f,  1.0f,
            -1.0f,  1.0f,  1.0f, 0.0f, 0.0f,  1.0f,
            -1.0f, -1.0f, -1.0f, -1.0f, 0.0f, 0.0f,
             1.0f, -1.0f, -1.0f,  1.0f, 0.0f, 0.0f,
             1.0f, -1.0f,  1.0f,  1.0f, 0.0f, 0.0f,
            -1.0f, -1.0f,  1.0f, -1.0f, 0.0f, 0.0f,
            -1.0f,  1.0f, -1.0f, -1.0f, 0.0f, 0.0f,
             1.0f,  1.0f, -1.0f,  1.0f, 0.0f, 0.0f,
             1.0f,  1.0f,  1.0f,  1.0f, 0.0f, 0.0f,
            -1.0f,  1.0f,  1.0f, -1.0f, 0.0f, 0.0f
        };

        private uint[] _indices =
        {
            0, 1, 2, 2, 3, 0,
            4, 5, 6, 6, 7, 4,
            0, 4, 5, 5, 1, 0,
            2, 6, 7, 7, 3, 2,
            0, 3, 7, 7, 4, 0,
            1, 5, 6, 6, 2, 1
        };

        protected override void OnLoad()
        {
            base.OnLoad();
            GL.ClearColor(0.1f, 0.1f, 0.1f, 1.0f);
            GL.Enable(EnableCap.DepthTest);

            _vertexArrayObject = GL.GenVertexArray();
            GL.BindVertexArray(_vertexArrayObject);

            _vertexBufferObject = GL.GenBuffer();
            GL.BindBuffer(BufferTarget.ArrayBuffer, _vertexBufferObject);
            GL.BufferData(BufferTarget.ArrayBuffer, _vertices.Length * sizeof(float), _vertices, BufferUsageHint.StaticDraw);

            _elementBufferObject = GL.GenBuffer();
            GL.BindBuffer(BufferTarget.ElementArrayBuffer, _elementBufferObject);
            GL.BufferData(BufferTarget.ElementArrayBuffer, _indices.Length * sizeof(uint), _indices, BufferUsageHint.StaticDraw);

            // Shader setup
            _shaderProgram = CreateShaderProgram();
            GL.UseProgram(_shaderProgram);
        }

        private int CreateShaderProgram()
        {
            string vertexShaderSource = @"
            #version 330 core
            layout(location = 0) in vec3 position;
            layout(location = 1) in vec3 normal;

            out vec3 fragNormal;

            void main()
            {
                gl_Position = vec4(position, 1.0);
                fragNormal = normal;
            }";

            string fragmentShaderSource = @"
            #version 330 core
            in vec3 fragNormal;

            out vec4 color;

            void main()
            {
                vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                float brightness = max(dot(fragNormal, lightDir), 0.0);
                color = vec4(brightness, brightness, brightness, 1.0);
            }";

            int vertexShader = CompileShader(ShaderType.VertexShader, vertexShaderSource);
            int fragmentShader = CompileShader(ShaderType.FragmentShader, fragmentShaderSource);

            int shaderProgram = GL.CreateProgram();
            GL.AttachShader(shaderProgram, vertexShader);
            GL.AttachShader(shaderProgram, fragmentShader);
            GL.LinkProgram(shaderProgram);

            GL.DeleteShader(vertexShader);
            GL.DeleteShader(fragmentShader);

            return shaderProgram;
        }

        private int CompileShader(ShaderType type, string source)
        {
            int shader = GL.CreateShader(type);
            GL.ShaderSource(shader, source);
            GL.CompileShader(shader);
            return shader;
        }

        protected override void OnRenderFrame(FrameEventArgs e)
        {
            GL.Clear(ClearBufferMask.ColorBufferBit | ClearBufferMask.DepthBufferBit);
            GL.BindVertexArray(_vertexArrayObject);
            GL.DrawElements(PrimitiveType.Triangles, _indices.Length, DrawElementsType.UnsignedInt, 0);
            SwapBuffers();
        }

        [STAThread]
        public static void Main()
        {
            using (Game game = new Game())
            {
                game.Run();
            }
        }
    }
}
