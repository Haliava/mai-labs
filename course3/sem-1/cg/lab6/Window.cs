using OpenTK.Windowing.Common;
using OpenTK.Windowing.Desktop;
using OpenTK.Graphics.OpenGL;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KGBase.Primitives;
using OpenTK.Mathematics;
using KGBase.Resourses;
using OpenTK.Windowing.GraphicsLibraryFramework;
using Object = KGBase.Primitives.Object;
using static KGBase.Primitives.Object;

namespace KGBase
{
    class Window : GameWindow
    {

        public static Shader figureShader;
        public static Shader lightShader;
        private int height, width;
        private Camera camera;
        private double elapsedTime = 0;

        private double timeToChangeDirection = 2;
        private double elapsedTimeDirection = 0;

        private bool jump = false;
        private double jumpTime = 0.3;
        private float jumpSpeed = 2;

        private bool _firstMove = true;
        private Vector2 _lastPos;
        private List<Scene> scenes = new List<Scene>();
        int activeScene = 0;

        public Window(int width, int height, string title): 
            base(GameWindowSettings.Default, new NativeWindowSettings() { Size = (width, height), Title = title}){
            this.width = width;
            this.height = height;
        }

        protected override void OnUpdateFrame(FrameEventArgs e)
        {
            base.OnUpdateFrame(e);

            Random random = new Random();

            if(elapsedTimeDirection >= timeToChangeDirection){
                foreach (Object obj in scenes[activeScene].getObjects())
                {
                    if(obj._type != ObjectType.bullet && obj._type != ObjectType.platform)
                    {
                        obj.Velocity = new Vector3(random.Next(-3, 4), 0, random.Next(-3, 4));
                        obj._figure.rotation = new Vector3(random.Next(-100, 100), random.Next(-100, 100), random.Next(-100, 100));
                    }
                }
                elapsedTimeDirection = 0;
            }
            elapsedTimeDirection += e.Time;

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
                camera.Position += new Vector3(camera.Front.X, 0, camera.Front.Z) * cameraSpeed * (float)e.Time;
            }
            if (input.IsKeyDown(Keys.S))
            {
                camera.Position -= new Vector3(camera.Front.X, 0, camera.Front.Z) * cameraSpeed * (float)e.Time;
            }
            if (input.IsKeyDown(Keys.A))
            {
                camera.Position -= camera.Right * cameraSpeed * (float)e.Time;
            }
            if (input.IsKeyDown(Keys.D))
            {
                camera.Position += camera.Right * cameraSpeed * (float)e.Time;
            }
            if (input.IsKeyPressed(Keys.Space))
            {
                if(!jump)
                    jump = true;
            }

            if (jump)
            {
                if (elapsedTime <= jumpTime){
                    camera.Position += new Vector3(0, 1, 0) * jumpSpeed * (float)e.Time;
                }
                else
                {
                    camera.Position -= new Vector3(0, 1, 0) * jumpSpeed * (float)e.Time;
                }
                elapsedTime += e.Time;

                if (camera.Position.Y <= 0.5)
                {
                    jump = false;
                    elapsedTime = 0;
                    camera.Position = new Vector3(camera.Position.X, (float)0.5, camera.Position.Z);
                }

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

        protected override void OnMouseDown(MouseButtonEventArgs e)
        {
            base.OnMouseDown(e);
            Sphere cube1 = new Sphere([1, 0, 1, 0], figureShader, (float)0.1, 30, 30);
            cube1.coordinates = camera.Position + camera.Front * (float)2;
            Object obj = new Object(cube1);
            obj._type = ObjectType.bullet;
            obj.Velocity = camera.Front * 50;
            obj._collider.intersectAction = (Object other) => { obj._state = ObjectState.dead; };

            scenes[activeScene].addObject(obj);
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

            Random rand = new Random();
            camera.Position = new Vector3(0, (float)0.5, 0);
            scenes.Add(new Scene());

            DirLight light = new DirLight();
            light.Direction = new Vector3(0, -1, -1);
            scenes[activeScene].addLight(light);

            Cube platform = new Cube([1, 1, 1, 1]);
            platform.scale = new Vector3(1000, 1, 1000);
            platform.coordinates = new Vector3(0, -2, 0);
            Object platformObj = new Object(platform);
            platformObj._type = ObjectType.platform;
            scenes[activeScene].addObject(platformObj);

            ObjLoader loader1 = new ObjLoader("../../../Resourses/IronMan.obj");
            ObjLoader loader2 = new ObjLoader("../../../Resourses/bugatti.obj");
            ObjLoader loader3 = new ObjLoader("../../../Resourses/rp_dennis_posed_004_100k.OBJ");
            ObjLoader loader4 = new ObjLoader("../../../Resourses/Wolf_One_obj.obj");

            {
                Obj obj1 = new Obj(loader1, [(float)rand.NextDouble(), (float)rand.NextDouble(), (float)rand.NextDouble(), 1]);
                obj1.coordinates = new Vector3(0, -1, 0);
                obj1.scale = new Vector3((float)0.01, (float)0.01, (float)0.01);
                Object objct = new Object(obj1);
                objct._collider.intersectAction = (Object objctInt) => { if (objctInt._type == ObjectType.bullet) objct._state = ObjectState.dead; };
                scenes[activeScene].addObject(objct);

                Obj obj2 = new Obj(loader1, [(float)rand.NextDouble(), (float)rand.NextDouble(), (float)rand.NextDouble(), 1]);
                obj2.coordinates = new Vector3(0, -1, 0);
                obj2.scale = new Vector3((float)0.01, (float)0.01, (float)0.01);
                Object objct2 = new Object(obj2);
                objct2._collider.intersectAction = (Object objctInt) => { if (objctInt._type == ObjectType.bullet) objct2._state = ObjectState.dead; };
                scenes[activeScene].addObject(objct2);

                Obj obj3 = new Obj(loader1, [(float)rand.NextDouble(), (float)rand.NextDouble(), (float)rand.NextDouble(), 1]);
                obj3.coordinates = new Vector3(0, -1, 0);
                obj3.scale = new Vector3((float)0.01, (float)0.01, (float)0.01);
                Object objct3 = new Object(obj3);
                objct3._collider.intersectAction = (Object objctInt) => { if (objctInt._type == ObjectType.bullet) objct3._state = ObjectState.dead; };
                scenes[activeScene].addObject(objct3);
            }

            {
                Obj obj1 = new Obj(loader3, [(float)rand.NextDouble(), (float)rand.NextDouble(), (float)rand.NextDouble(), 1]);
                obj1.coordinates = new Vector3(0, -1, 0);
                obj1.scale = new Vector3((float)0.01, (float)0.01, (float)0.01);
                Object objct = new Object(obj1);
                objct._collider.intersectAction = (Object objctInt) => { if (objctInt._type == ObjectType.bullet) objct._state = ObjectState.dead; };
                scenes[activeScene].addObject(objct);

                Obj obj2 = new Obj(loader3, [(float)rand.NextDouble(), (float)rand.NextDouble(), (float)rand.NextDouble(), 1]);
                obj2.coordinates = new Vector3(0, -1, 0);
                obj2.scale = new Vector3((float)0.01, (float)0.01, (float)0.01);
                Object objct2 = new Object(obj2);
                objct2._collider.intersectAction = (Object objctInt) => { if (objctInt._type == ObjectType.bullet) objct2._state = ObjectState.dead; };
                scenes[activeScene].addObject(objct2);

                Obj obj3 = new Obj(loader3, [(float)rand.NextDouble(), (float)rand.NextDouble(), (float)rand.NextDouble(), 1]);
                obj3.coordinates = new Vector3(0, -1, 0);
                obj3.scale = new Vector3((float)0.01, (float)0.01, (float)0.01);
                Object objct3 = new Object(obj3);
                objct3._collider.intersectAction = (Object objctInt) => { if (objctInt._type == ObjectType.bullet) objct3._state = ObjectState.dead; };
                scenes[activeScene].addObject(objct3);
            }

            {
                Obj obj1 = new Obj(loader4, [(float)rand.NextDouble(), (float)rand.NextDouble(), (float)rand.NextDouble(), 1]);
                obj1.coordinates = new Vector3(0, -1, 0);
                obj1.scale = new Vector3(2, 2, 2);
                Object objct = new Object(obj1);
                objct._collider.intersectAction = (Object objctInt) => { if (objctInt._type == ObjectType.bullet) objct._state = ObjectState.dead; };
                scenes[activeScene].addObject(objct);

                Obj obj2 = new Obj(loader4, [(float)rand.NextDouble(), (float)rand.NextDouble(), (float)rand.NextDouble(), 1]);
                obj2.coordinates = new Vector3(0, -1, 0);
                obj2.scale = new Vector3(2, 2, 2);
                Object objct2 = new Object(obj2);
                objct2._collider.intersectAction = (Object objctInt) => { if (objctInt._type == ObjectType.bullet) objct2._state = ObjectState.dead; };
                scenes[activeScene].addObject(objct2);

                Obj obj3 = new Obj(loader4, [(float)rand.NextDouble(), (float)rand.NextDouble(), (float)rand.NextDouble(), 1]);
                obj3.coordinates = new Vector3(0, -1, 0);
                obj3.scale = new Vector3(2, 2, 2);
                Object objct3 = new Object(obj3);
                objct3._collider.intersectAction = (Object objctInt) => { if (objctInt._type == ObjectType.bullet) objct3._state = ObjectState.dead; };
                scenes[activeScene].addObject(objct3);
            }

        }

        //Вызывается каждое обновление кадра
        protected void UpdateLoop(FrameEventArgs args)
        {

            scenes[activeScene].Draw(args.Time, camera, (float) width / height);

        }

    }
}
