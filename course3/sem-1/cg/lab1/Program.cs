using OpenTK.Windowing.Common;
using OpenTK.Windowing.Desktop;
using OpenTK.Graphics.OpenGL4;
using OpenTK.Mathematics;
using System;

public class BezierCurveApp : GameWindow
{
    private int _vao, _vbo, _program, _pointVao, _pointVbo;
    private Vector2[] _controlPoints = {
        new Vector2(-0.7f, -0.7f),
        new Vector2(0.2f, 0.7f),
        new Vector2(0.7f, -0.7f)
    };
    private int _selectedPoint = -1;

    public BezierCurveApp() : base(GameWindowSettings.Default, NativeWindowSettings.Default)
    {
        Title = "Bézier Curve with Movable Control Points";
        Size = new Vector2i(Size.X, Size.Y);
    }

    protected override void OnLoad()
    {
        base.OnLoad();

        GL.ClearColor(0.1f, 0.1f, 0.1f, 1.0f);

        _program = CompileShaders();

        _vao = GL.GenVertexArray();
        _vbo = GL.GenBuffer();

        GL.BindVertexArray(_vao);
        GL.BindBuffer(BufferTarget.ArrayBuffer, _vbo);
        GL.BufferData(BufferTarget.ArrayBuffer, 100 * Vector2.SizeInBytes, IntPtr.Zero, BufferUsageHint.DynamicDraw);

        int positionLocation = GL.GetAttribLocation(_program, "aPosition");
        GL.VertexAttribPointer(positionLocation, 2, VertexAttribPointerType.Float, false, Vector2.SizeInBytes, 0);
        GL.EnableVertexAttribArray(positionLocation);

        GL.BindVertexArray(0);

        _pointVao = GL.GenVertexArray();
        _pointVbo = GL.GenBuffer();

        GL.BindVertexArray(_pointVao);
        GL.BindBuffer(BufferTarget.ArrayBuffer, _pointVbo);
        GL.BufferData(BufferTarget.ArrayBuffer, Vector2.SizeInBytes * _controlPoints.Length, IntPtr.Zero, BufferUsageHint.DynamicDraw);

        GL.VertexAttribPointer(positionLocation, 2, VertexAttribPointerType.Float, false, Vector2.SizeInBytes, 0);
        GL.EnableVertexAttribArray(positionLocation);

        GL.BindVertexArray(0);
    }

    protected override void OnUpdateFrame(FrameEventArgs args)
    {
        base.OnUpdateFrame(args);

        Vector2 mousePos = new Vector2(
            2.0f * MouseState.Position.X / Size.X - 1.0f, // windowWidth -> [-1, 1]
            -2.0f * (MouseState.Position.Y / Size.Y) + 1.0f // windowHeight -> [-1, 1]
        );

        if (MouseState.IsButtonDown(OpenTK.Windowing.GraphicsLibraryFramework.MouseButton.Left))
        {
            Console.WriteLine(MouseState.Position.Y);
            Console.WriteLine(Size.Y);
            if (_selectedPoint == -1)
            {
                for (int i = 0; i < _controlPoints.Length; i++)
                {
                    if ((mousePos - _controlPoints[i]).Length < 0.1f)
                    {
                        _selectedPoint = i;
                        break;
                    }
                }
            }

            if (_selectedPoint != -1)
            {
                _controlPoints[_selectedPoint] = new Vector2(mousePos.X, mousePos.Y - 0.1f);
            }
        }
        else
        {
            _selectedPoint = -1;
        }
    }
    protected override void OnResize(ResizeEventArgs e)
    {
        base.OnResize(e);
        GL.Viewport(0, 0, Size.X, Size.Y);
    }

    protected override void OnRenderFrame(FrameEventArgs args)
    {
        base.OnRenderFrame(args);

        GL.Clear(ClearBufferMask.ColorBufferBit);

        GL.UseProgram(_program);

        Vector2[] bezierPoints = new Vector2[100];
        for (int i = 0; i < bezierPoints.Length; i++)
        {
            float t = i / (float)(bezierPoints.Length - 1);
            bezierPoints[i] = MathF.Pow(1 - t, 2) * _controlPoints[0] +
                              2 * (1 - t) * t * _controlPoints[1] +
                              MathF.Pow(t, 2) * _controlPoints[2];
        }

        GL.BindBuffer(BufferTarget.ArrayBuffer, _vbo);
        GL.BufferSubData(BufferTarget.ArrayBuffer, IntPtr.Zero, bezierPoints.Length * Vector2.SizeInBytes, bezierPoints);
        GL.BindVertexArray(_vao);

        GL.Uniform4(GL.GetUniformLocation(_program, "uColor"), new Vector4(1.0f, 0.5f, 0.2f, 1.0f));
        GL.DrawArrays(PrimitiveType.LineStrip, 0, bezierPoints.Length);

        GL.BindBuffer(BufferTarget.ArrayBuffer, _pointVbo);
        GL.BufferSubData(BufferTarget.ArrayBuffer, IntPtr.Zero, _controlPoints.Length * Vector2.SizeInBytes, _controlPoints);
        GL.BindVertexArray(_pointVao);

        GL.PointSize(10.0f);
        GL.Uniform4(GL.GetUniformLocation(_program, "uColor"), new Vector4(0.2f, 0.8f, 1.0f, 1.0f));
        GL.DrawArrays(PrimitiveType.Points, 0, _controlPoints.Length);

        GL.BindVertexArray(0);

        SwapBuffers();
    }

    protected override void OnUnload()
    {
        base.OnUnload();

        GL.DeleteBuffer(_vbo);
        GL.DeleteBuffer(_pointVbo);
        GL.DeleteVertexArray(_vao);
        GL.DeleteVertexArray(_pointVao);
        GL.DeleteProgram(_program);
    }

    private int CompileShaders()
    {
        string vertexShaderCode = @"
#version 430 core
layout (location = 0) in vec2 aPosition;
void main()
{
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
";

        string fragmentShaderCode = @"
#version 430 core
out vec4 FragColor;
uniform vec4 uColor;
void main()
{
    FragColor = uColor;
}
";

        int vertexShader = GL.CreateShader(ShaderType.VertexShader);
        GL.ShaderSource(vertexShader, vertexShaderCode);
        GL.CompileShader(vertexShader);

        int fragmentShader = GL.CreateShader(ShaderType.FragmentShader);
        GL.ShaderSource(fragmentShader, fragmentShaderCode);
        GL.CompileShader(fragmentShader);

        int shaderProgram = GL.CreateProgram();
        GL.AttachShader(shaderProgram, vertexShader);
        GL.AttachShader(shaderProgram, fragmentShader);
        GL.LinkProgram(shaderProgram);

        GL.DeleteShader(vertexShader);
        GL.DeleteShader(fragmentShader);

        return shaderProgram;
    }

    public static void Main()
    {
        using (var app = new BezierCurveApp())
        {
            app.Run();
        }
    }
}