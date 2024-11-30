using KGBase.Resourses;
using OpenTK.Mathematics;
using OpenTK.Graphics.OpenGL;

namespace KGBase.Primitives
{
    class Plane : Figure
    {
        public Plane(Vector3 position, Vector3 size, Vector4 color, Shader shader)
        {
            this.coordinates = position;
            this.scale = size;
            this.shader = shader;

            // Определение вершин плоскости (прямоугольник в XZ плоскости)
            vertices = new float[]
            {
                // Позиции (X, Y, Z)            // Нормали (X, Y, Z)
                -1.0f, 0.0f, -1.0f,             0.0f, 1.0f, 0.0f,
                 1.0f, 0.0f, -1.0f,             0.0f, 1.0f, 0.0f,
                 1.0f, 0.0f,  1.0f,             0.0f, 1.0f, 0.0f,
                -1.0f, 0.0f,  1.0f,             0.0f, 1.0f, 0.0f,
            };

            // Цвет каждой вершины
            colors = new float[]
            {
                color.X, color.Y, color.Z, color.W,
                color.X, color.Y, color.Z, color.W,
                color.X, color.Y, color.Z, color.W,
                color.X, color.Y, color.Z, color.W
            };

            // Порядок индексов для рисования плоскости (два треугольника)
            indices = new int[]
            {
                0, 1, 2,
                2, 3, 0
            };

            // Настройка буферов
            SetUpBuffers();
        }

        public void DrawWithRaytracing(List<Light> lights, Camera camera, float wh, int planeIndex)
        {
            this.shader.Use();

            // Передаем стандартные трансформации
            Matrix4 model =
                Matrix4.CreateScale(scale.X, scale.Y, scale.Z) *
                Matrix4.CreateRotationX(MathHelper.DegreesToRadians(rotation.X)) *
                Matrix4.CreateRotationY(MathHelper.DegreesToRadians(rotation.Y)) *
                Matrix4.CreateRotationZ(MathHelper.DegreesToRadians(rotation.Z)) *
                Matrix4.CreateTranslation(this.coordinates);

            shader.SetMatrix4("model", model);
            shader.SetMatrix4("projection", Matrix4.CreatePerspectiveFieldOfView(MathHelper.DegreesToRadians(camera.Fov), wh, 0.1f, 100.0f));
            shader.SetMatrix4("view", camera.GetViewMatrix());

            // Передаем параметры плоскости для рейтрейсинга
            Vector3 normal = Vector3.UnitY; // Нормаль плоскости (по умолчанию вверх)
            Vector3 transformedNormal = Vector3.TransformNormal(normal, model); // Трансформируем нормаль
            shader.SetVector3($"planes[{planeIndex}].position", coordinates);
            shader.SetVector3($"planes[{planeIndex}].normal", transformedNormal);

            // Передаем цвет плоскости
            GL.Uniform4(GL.GetUniformLocation(shader.Handle, $"planes[{planeIndex}].color"), new Vector4(colors[0], colors[1], colors[2], colors[3]));

            // Передаем параметры материала
            GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"planes[{planeIndex}].ambient"), ambient);
            GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"planes[{planeIndex}].diffuse"), diffuse);
            GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"planes[{planeIndex}].specular"), specular);
            GL.Uniform1(GL.GetUniformLocation(shader.Handle, $"planes[{planeIndex}].shininess"), shininess);

            // Рисуем плоскость как обычный объект (если нужно)
            GL.BindVertexArray(this.VertexArrayObject);
            GL.DrawElements(PrimitiveType.Triangles, this.indices.Length, DrawElementsType.UnsignedInt, 0);
            GL.BindVertexArray(0);
        }
    }
}
