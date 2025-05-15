using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KGBase.Resourses;

namespace KGBase.Primitives
{
    class Obj : Figure
    {
        public Obj(ObjLoader loader, float[] colors) {
            this.shader = Window.figureShader;

            this.indices = loader.Indices;
            this.vertices = loader.Vertices;

            if (colors.Length == 4)
            {
                this.colors = new float[this.vertices.Length / 6 * 4];
                for (int i = 0; i < this.colors.Length; ++i)
                {
                    this.colors[i] = colors[i % 4];
                }
            }
            else
            { this.colors = colors; }

            SetUpBuffers();
        }
        public Obj(string path, float[] colors) : this(path, colors, Window.figureShader) {}
        public Obj(string path, float[] colors, Shader shader) {

            this.shader = shader;

            ObjLoader loader = new ObjLoader(path);

            this.indices = loader.Indices;
            this.vertices = loader.Vertices;

            if (colors.Length == 4)
            {
                this.colors = new float[this.vertices.Length/6 * 4];
                for (int i = 0; i < this.colors.Length; ++i)
                {
                    this.colors[i] = colors[i % 4];
                }
            }
            else
            { this.colors = colors; }

            SetUpBuffers();

        }
    }
}
