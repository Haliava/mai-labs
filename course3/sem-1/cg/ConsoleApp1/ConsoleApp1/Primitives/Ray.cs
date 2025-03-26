using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1.Primitives
{
    internal class Ray
    {
        public System.Numerics.Vector3 Origin;
        public System.Numerics.Vector3 Direction;

        public Ray(System.Numerics.Vector3 origin, System.Numerics.Vector3 direction)
        {
            Origin = origin;
            Direction = direction;
        }
    }
}
