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

    }
}
