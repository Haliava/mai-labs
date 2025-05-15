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
            GL.VertexAttribPointer(0, 3, VertexAttribPointerType.Float, false, 3 * sizeof(float), 0);
            GL.EnableVertexAttribArray(0);

            GL.BindBuffer(BufferTarget.ArrayBuffer, this.ColorBufferObject);
            GL.BufferData(BufferTarget.ArrayBuffer, this.colors.Length * sizeof(float), this.colors, BufferUsageHint.StaticDraw);
            GL.VertexAttribPointer(1, 4, VertexAttribPointerType.Float, false, 4 * sizeof(float), 0);
            GL.EnableVertexAttribArray(1);

            GL.BindVertexArray(0);

        }

        public void Draw()
        {

            this.shader.Use();

            Matrix4 model = Matrix4.CreateScale(scale.X, scale.Y, scale.Z) *
                Matrix4.CreateRotationX(MathHelper.DegreesToRadians(rotation.X)) *
                Matrix4.CreateRotationY(MathHelper.DegreesToRadians(rotation.Y)) *
                Matrix4.CreateRotationZ(MathHelper.DegreesToRadians(rotation.Z));
                

            shader.SetMatrix4("model", model);
            shader.SetMatrix4("cords", Matrix4.CreateTranslation(this.coordinates));
            Window.SetMatrixes(shader);

            GL.BindVertexArray(this.VertexArrayObject);
            GL.DrawElements(PrimitiveType.Triangles, this.indices.Length, DrawElementsType.UnsignedInt, 0);
            GL.BindVertexArray(0);

        }

    }
}
