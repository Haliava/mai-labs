using KGBase.Resourses;
using OpenTK.Graphics.OpenGL;
using OpenTK.Mathematics;

namespace KGBase.Primitives
{
    //Для создания нового типа фигур необходимо пронаследоваться от этого класса у в конструкторе
    //определить набор вершин в 3d системе координат от -1 до 1 в vertices, цвет каждой вершины в RGBA в colors
    //и определить порядок рисования треугольников в indices через указание набора каждого треугольника из трех вершин
    //в конце просто вызываешь SetUpBuffers
    abstract class Figure
    {

        protected float[] vertices;
        protected float[] colors;
        protected int[] indices;

        protected int VertexArrayObject;

        protected int ColorBufferObject;
        protected int VertexBufferObject;
        protected int ElementBufferObject;

        protected Shader shader;

        public Vector3 coordinates = new Vector3(0f, 0f, 0f);
        public Vector3 rotation = new Vector3(0f, 0f, 0f);
        public Vector3 scale = new Vector3(1f, 1f, 1f);
        public bool isLight = false;
        public float ambient = 1;
        public float diffuse = 1;
        public float specular = 0.5f;
        public float shininess = 32;

        public Vector3[] getVertices()
        {
            Vector3[] returnVectors = new Vector3[vertices.Length/6];
            Vector3 putVector = new Vector3();

            for(int i = 0; i < vertices.Length; ++i)
            {
                if(i % 6 < 3)
                {
                    putVector[i % 6] = (vertices[i] + coordinates[i % 6]) * scale[i % 6];
                }
                else if(i % 6 == 5)
                {
                    returnVectors[i / 6] = putVector;
                    putVector = new Vector3();
                }
            }

            return returnVectors;
        }
        protected void SetUpBuffers()
        {

            this.VertexBufferObject = GL.GenBuffer();
            this.ColorBufferObject = GL.GenBuffer();
            this.ElementBufferObject = GL.GenBuffer();

            this.VertexArrayObject = GL.GenVertexArray();

            GL.BindVertexArray(this.VertexArrayObject);

            GL.BindBuffer(BufferTarget.ArrayBuffer, this.VertexBufferObject);
            GL.BufferData(BufferTarget.ArrayBuffer, this.vertices.Length * sizeof(float), this.vertices, BufferUsageHint.StaticDraw);

            GL.BindBuffer(BufferTarget.ElementArrayBuffer, this.ElementBufferObject);
            GL.BufferData(BufferTarget.ElementArrayBuffer, this.indices.Length * sizeof(int), this.indices, BufferUsageHint.StaticDraw);

            GL.BindBuffer(BufferTarget.ArrayBuffer, this.VertexBufferObject);
            GL.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), 0);
            GL.EnableVertexAttribArray(0);
            GL.VertexAttribPointer(1, 3, VertexAttribPointerType.Float, false, 6 * sizeof(float), 3 * sizeof(float));
            GL.EnableVertexAttribArray(1);

            GL.BindBuffer(BufferTarget.ArrayBuffer, this.ColorBufferObject);
            GL.BufferData(BufferTarget.ArrayBuffer, this.colors.Length * sizeof(float), this.colors, BufferUsageHint.StaticDraw);
            GL.VertexAttribPointer(2, 4, VertexAttribPointerType.Float, false, 4 * sizeof(float), 0);
            GL.EnableVertexAttribArray(2);

            GL.BindVertexArray(0);

        }

        public void Draw(List<Light> lights, Camera camera, float wh)
        {

            this.shader.Use();

            Matrix4 model =
                Matrix4.CreateScale(scale.X, scale.Y, scale.Z) *
                Matrix4.CreateRotationX(MathHelper.DegreesToRadians(rotation.X)) *
                Matrix4.CreateRotationY(MathHelper.DegreesToRadians(rotation.Y)) *
                Matrix4.CreateRotationZ(MathHelper.DegreesToRadians(rotation.Z)) *
                Matrix4.CreateTranslation(this.coordinates);

            shader.SetMatrix4("model", model);
            shader.SetMatrix4("projection", Matrix4.CreatePerspectiveFieldOfView(MathHelper.DegreesToRadians(camera.Fov), wh, 0.1f, 100.0f));
            shader.SetMatrix4("view", camera.GetViewMatrix());

            if(!isLight){
                shader.SetVector3("viewPos", camera.Position);
                GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"material.ambient"), this.ambient);
                GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"material.diffuse"), this.diffuse);
                GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"material.specular"), this.specular);
                GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"material.shininess"), this.shininess);

                int pointCounter = 0, dirCounter = 0, spotCounter = 0;
                foreach(Light light in lights)
                {
                    if(light is PointLight)
                    {
                        PointLight pointLight = (PointLight)light;
                        GL.Uniform3(GL.GetUniformLocation(shader.Handle, $"pointLights[{pointCounter}].position"), pointLight.Position);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"pointLights[{pointCounter}].ambient"), pointLight.ambient);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"pointLights[{pointCounter}].diffuse"), pointLight.diffuse);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"pointLights[{pointCounter}].specular"), pointLight.specular);
                        GL.Uniform3(GL.GetUniformLocation(shader.Handle, $"pointLights[{pointCounter}].color"), pointLight.Color);


                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"pointLights[{pointCounter}].constant"), pointLight.constant);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"pointLights[{pointCounter}].linear"), pointLight.linear);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"pointLights[{pointCounter}].quadratic"), pointLight.quadratic);

                        ++pointCounter;
                    }
                    else if(light is DirLight)
                    {
                        DirLight dirLight = (DirLight)light;
                        GL.Uniform3(GL.GetUniformLocation(shader.Handle, $"dirLights[{dirCounter}].direction"), dirLight.Direction);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"dirLights[{dirCounter}].ambient"), dirLight.ambient);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"dirLights[{dirCounter}].diffuse"), dirLight.diffuse);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"dirLights[{dirCounter}].specular"), dirLight.specular);
                        GL.Uniform3(GL.GetUniformLocation(shader.Handle, $"dirLights[{dirCounter}].color"), dirLight.Color);

                        ++dirCounter;
                    }
                    else if(light is SpotLight)
                    {
                        SpotLight spotLight = (SpotLight)light;
                        GL.Uniform3(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].position"), spotLight.Position);
                        GL.Uniform3(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].direction"), spotLight.Direction);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].ambient"), spotLight.ambient);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].diffuse"), spotLight.diffuse);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].specular"), spotLight.specular);
                        GL.Uniform3(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].color"), spotLight.Color);

                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].constant"), spotLight.constant);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].linear"), spotLight.linear);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].quadratic"), spotLight.quadratic);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].cutOff"), spotLight.cutOff);
                        GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"spotLights[{spotCounter}].outerCutOff"), spotLight.outerCutOff);

                        ++spotCounter;
                    }
                }

                GL.Uniform1(GL.GetUniformLocation(shader.Handle, "numPointLights"), pointCounter);
                GL.Uniform1(GL.GetUniformLocation(shader.Handle, "numDirLights"), dirCounter);
                GL.Uniform1(GL.GetUniformLocation(shader.Handle, "numSpotLights"), spotCounter);
            }

            GL.BindVertexArray(this.VertexArrayObject);
            GL.DrawElements(PrimitiveType.Triangles, this.indices.Length, DrawElementsType.UnsignedInt, 0);
            GL.BindVertexArray(0);

        }

    }
}
