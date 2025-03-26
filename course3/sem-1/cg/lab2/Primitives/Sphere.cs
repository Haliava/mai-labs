using KGBase.Resourses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenTK.Graphics.OpenGL;
using OpenTK.Mathematics;

namespace KGBase.Primitives
{
    class Sphere : Figure
    {

        public Sphere(float[] colors, Shader shader, float radius, int rings, int sectors)
        {

            List<float> vertices = new List<float>();
            List<int> indices = new List<int>();
            List<float> colorsList = new List<float>();

            for (int r = 0; r <= rings; ++r)
            {
                float theta = r * MathF.PI / rings;
                float sinTheta = MathF.Sin(theta);
                float cosTheta = MathF.Cos(theta);

                for (int s = 0; s <= sectors; ++s)
                {
                    float phi = s * 2 * MathF.PI / sectors;
                    float sinPhi = MathF.Sin(phi);
                    float cosPhi = MathF.Cos(phi);

                    float x = cosPhi * sinTheta;
                    float y = cosTheta;
                    float z = sinPhi * sinTheta;

                    vertices.Add(x * radius);
                    vertices.Add(y * radius);
                    vertices.Add(z * radius);
                    
                    foreach(float f  in colors)
                        colorsList.Add(f);
                }
            }

            for (int r = 0; r < rings; ++r)
            {
                for (int s = 0; s < sectors; ++s)
                {
                    int first = (r * (sectors + 1)) + s;
                    int second = first + sectors + 1;

                    indices.Add(first);
                    indices.Add(second);
                    indices.Add(first + 1);

                    indices.Add(second);
                    indices.Add(second + 1);
                    indices.Add(first + 1);
                }

            }

            this.shader = shader;
            this.indices = indices.ToArray();
            this.vertices = vertices.ToArray();
            this.colors = colorsList.ToArray();

            this.SetUpBuffers();

        }
        
    }
}
