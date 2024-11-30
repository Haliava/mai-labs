using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KGBase.Resourses;
using OpenTK.Graphics.OpenGL;

namespace KGBase.Primitives
{
    class Cube : Figure
    {
        public Cube(float[] colors) : this(colors, Window.figureShader){}
        public Cube(float[] colors, Shader shader)
        {

            this.shader = shader;

            this.vertices = [
                // Позиции         // Нормали
                // Передняя грань
                -0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f, // Нижний левый
                 0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f, // Нижний правый
                 0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f, // Верхний правый
                -0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f, // Верхний левый

                // Задняя грань
                -0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
                 0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
                 0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
                -0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,

                // Левая грань
                -0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
                -0.5f, -0.5f,  0.5f, -1.0f,  0.0f,  0.0f,
                -0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,
                -0.5f,  0.5f, -0.5f, -1.0f,  0.0f,  0.0f,

                // Правая грань
                 0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
                 0.5f, -0.5f,  0.5f,  1.0f,  0.0f,  0.0f,
                 0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,
                 0.5f,  0.5f, -0.5f,  1.0f,  0.0f,  0.0f,

                // Нижняя грань
                -0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,
                 0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,
                 0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
                -0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,

                // Верхняя грань
                -0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,
                 0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,
                 0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
                -0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f
            ];

            if (colors.Length == 4)
            {
                this.colors = new float[24 * 4];
                for(int i = 0; i < this.colors.Length; ++i)
                {
                    this.colors[i] = colors[i % 4];
                }
            }
            else
            { this.colors = colors; }

            this.indices = [ 
                // Передняя грань
                0, 1, 2,
                2, 3, 0,

                // Задняя грань
                4, 5, 6,
                6, 7, 4,

                // Левая грань
                8, 9, 10,
                10, 11, 8,

                // Правая грань
                12, 13, 14,
                14, 15, 12,

                // Нижняя грань
                16, 17, 18,
                18, 19, 16,

                // Верхняя грань
                20, 21, 22,
                22, 23, 20
            ];

            this.SetUpBuffers();

        }

        public void setColors(float[] colors)
        {
            if (colors.Length == 4)
            {
                this.colors = new float[24 * 4];
                for (int i = 0; i < this.colors.Length; ++i)
                {
                    this.colors[i] = colors[i % 4];
                }
            }
            else
            { this.colors = colors; }

            this.SetUpBuffers();
        }

    }
}
