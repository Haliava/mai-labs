using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenTK.Mathematics;

namespace KGBase.Primitives
{
    class DirLight : Light
    {

        public Vector3 Direction = new Vector3(1, 0, 0);

        public override void Draw(Camera camera, float wh) {}
    }
}
