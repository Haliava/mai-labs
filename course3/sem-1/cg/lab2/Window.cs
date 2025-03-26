using OpenTK.Windowing.Common;
using OpenTK.Windowing.Desktop;
using OpenTK.Graphics.OpenGL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KGBase.Primitives;
using OpenTK.Mathematics;
using KGBase.Resourses;
using OpenTK.Windowing.GraphicsLibraryFramework;

namespace KGBase
{
    class Window : GameWindow
    {

        List<Figure> figures = new List<Figure>();
        Shader shader;
        static int height, width;
        static Camera camera;

        private bool _firstMove = true;
        private Vector2 _lastPos;

        Sphere sphere;

        public Window(int width, int height, string title): 
            base(GameWindowSettings.Default, new NativeWindowSettings() { Size = (width, height), Title = title}){
            Window.width = width;
            Window.height = height;
        }

        protected override void OnUpdateFrame(FrameEventArgs e)
        {
            base.OnUpdateFrame(e);

            if (!IsFocused)
            {
                return;
            }

            var input = KeyboardState;

            if (input.IsKeyDown(Keys.Escape))
            {
                Close();
            }

            const float cameraSpeed = 1.5f;
            const float sensitivity = 0.2f;

            if (input.IsKeyDown(Keys.W))
            {
                camera.Position += camera.Front * cameraSpeed * (float)e.Time;
            }
            if (input.IsKeyDown(Keys.S))
            {
                camera.Position -= camera.Front * cameraSpeed * (float)e.Time;
            }
            if (input.IsKeyDown(Keys.A))
            {
                camera.Position -= camera.Right * cameraSpeed * (float)e.Time;
            }
            if (input.IsKeyDown(Keys.D))
            {
                camera.Position += camera.Right * cameraSpeed * (float)e.Time;
            }
            if (input.IsKeyDown(Keys.Space))
            {
                camera.Position += camera.Up * cameraSpeed * (float)e.Time;
            }
            if (input.IsKeyDown(Keys.LeftShift))
            {
                camera.Position -= camera.Up * cameraSpeed * (float)e.Time;
            }
            if (input.IsKeyDown(Keys.Equal))
            {
                this.sphere.scale += new Vector3(1, 1, 1) * (float)e.Time;
            }
            if (input.IsKeyDown(Keys.Minus))
            {
                this.sphere.scale -= new Vector3(1, 1, 1) * (float)e.Time;
            }

            var mouse = MouseState;

            if (_firstMove)
            {
                _lastPos = new Vector2(mouse.X, mouse.Y);
                _firstMove = false;
            }
            else
            {

                var deltaX = mouse.X - _lastPos.X;
                var deltaY = mouse.Y - _lastPos.Y;
                _lastPos = new Vector2(mouse.X, mouse.Y);

                camera.Yaw += deltaX * sensitivity;
                camera.Pitch -= deltaY * sensitivity;
            }

        }

        protected override void OnMouseWheel(MouseWheelEventArgs e)
        {
            base.OnMouseWheel(e);

            camera.Fov -= e.OffsetY;
        }

        protected override void OnLoad()
        {
            base.OnLoad();

            GL.ClearColor(0.2f, 0.3f, 0.3f, 1.0f);
            GL.Enable(EnableCap.DepthTest);
            CursorState = CursorState.Grabbed;

            shader = new Shader("../../../Resourses/shader.vert", "../../../Resourses/shader.frag");
            camera = new Camera(new Vector3(0, 0, 3));

            SetUpObjects();

        }

        protected override void OnRenderFrame(FrameEventArgs args)
        {
            base.OnRenderFrame(args);

            GL.Clear(ClearBufferMask.ColorBufferBit | ClearBufferMask.DepthBufferBit);

            UpdateLoop(args);
            
            SwapBuffers();

        }

        protected override void OnUnload()
        {
            base.OnUnload();
            shader.Dispose();
        }

        protected override void OnFramebufferResize(FramebufferResizeEventArgs e)
        {
            base.OnFramebufferResize(e);

            GL.Viewport(0, 0, e.Width, e.Height);
            Window.width = e.Width;
            Window.height = e.Height;

        }

        public static void SetMatrixes(Shader _shader)
        {
            _shader.SetMatrix4("projection", Matrix4.CreatePerspectiveFieldOfView(MathHelper.DegreesToRadians(camera.Fov), (float) Window.width / Window.height, 0.1f, 100.0f));
            _shader.SetMatrix4("view", camera.GetViewMatrix());
        }

        //Вызывается один раз во время построения сцены
        protected void SetUpObjects()
        {

            this.sphere = new Sphere([0.5f, 1f, 0.5f, 1.0f], this.shader, 1, 20, 20);

            this.figures.Add(this.sphere);

        }

        //Вызывается каждое обновление кадра
        protected void UpdateLoop(FrameEventArgs args)
        {
            for(int i = 0; i < figures.Count; ++i)
            {
                figures[i].rotation += new Vector3(15 * (float) args.Time, 21 * (float)args.Time, 27 * (float)args.Time);
                figures[i].Draw();
            }
        }

    }
}
