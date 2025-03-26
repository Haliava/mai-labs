using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenTK.Mathematics;

namespace KGBase.Primitives
{
    abstract class Light
    {
        public Vector3 Position;
        public float ambient = 0.05f;
        public float diffuse = 0.8f;
        public float specular = 1.0f;
        public Vector3 Color = new Vector3(1, 1, 1);

        abstract public void Draw(Camera camera, float wh);

    }
}
