﻿using OpenTK.Windowing.Common;
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

        private List<Figure> figures = new List<Figure>();
        public static Shader figureShader;
        public static Shader lightShader;
        private int height, width;
        private Camera camera;

        private bool _firstMove = true;
        private Vector2 _lastPos;

        private List<Light> lights = new List<Light>();

        DirLight lightDir;
        public Window(int width, int height, string title): 
            base(GameWindowSettings.Default, new NativeWindowSettings() { Size = (width, height), Title = title}){
            this.width = width;
            this.height = height;
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

            figureShader = new Shader("../../../Resourses/shader.vert", "../../../Resourses/shader.frag");
            lightShader = new Shader("../../../Resourses/shader.vert", "../../../Resourses/light.frag");
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
            figureShader.Dispose();
        }

        protected override void OnFramebufferResize(FramebufferResizeEventArgs e)
        {
            base.OnFramebufferResize(e);

            GL.Viewport(0, 0, e.Width, e.Height);
            this.width = e.Width;
            this.height = e.Height;

        }

        //Вызывается один раз во время построения сцены
        protected void SetUpObjects()
        {

            Cube cube = new Cube([1, 0, 1, 0]);
            cube.shininess = 0;
            cube.specular = 0;
            figures.Add(cube);

            lightDir = new DirLight();
            lightDir.Direction = new Vector3(0, 1, 0);
            lights.Add(lightDir);

        }

        //Вызывается каждое обновление кадра
        protected void UpdateLoop(FrameEventArgs args)
        {

            float angleDelta = MathHelper.DegreesToRadians(45.0f) * (float) args.Time;
            Quaternion rotation = Quaternion.FromAxisAngle(new Vector3(1, 1, 1), angleDelta);
            lightDir.Direction = Vector3.Normalize(Vector3.Transform(lightDir.Direction, rotation));

            for (int i = 0; i < figures.Count; ++i)
            {
                figures[i].Draw(lights, camera, (float) width / height);
            }
            for(int i = 0; i < lights.Count; ++i)
            {
                lights[i].Draw(camera, (float) width / height);
            }
        }

    }
}
