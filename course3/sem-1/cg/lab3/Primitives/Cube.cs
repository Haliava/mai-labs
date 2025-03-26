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

        public Cube(float[] colors, Shader shader)
        {

            this.shader = shader;

            this.vertices = [
                -0.5f, -0.5f, 0.5f,
                -0.5f, -0.5f, -0.5f,
                0.5f, -0.5f, 0.5f,
                0.5f, -0.5f, -0.5f,
                -0.5f, 0.5f, 0.5f,
                -0.5f, 0.5f, -0.5f,
                0.5f, 0.5f, 0.5f,
                0.5f, 0.5f, -0.5f
            ];

            if (colors.Length == 4)
            {
                this.colors = new float[this.vertices.Length + this.vertices.Length / 3];
                for(int i = 0; i < this.colors.Length; ++i)
                {
                    this.colors[i] = colors[i % 4];
                }
            }
            else
            { this.colors = colors; }

            this.indices = [ 
                0, 2, 6,
                0, 4, 6,
                0, 1, 4,
                1, 4, 5,
                4, 5, 6,
                5, 6, 7,
                2, 6, 7,
                2, 3, 7,
                0, 1, 2,
                1, 2, 3,
                1, 3, 7,
                1, 5, 7
            ];

            this.SetUpBuffers();

        }

    }
}
