using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using OpenTK.Mathematics;
using System.Text;
using System.Threading.Tasks;

namespace KGBase.Primitives
{
    class Collider
    {
        public Vector3 Min;
        public Vector3 Max;
        public Action<Object> intersectAction = (Object other) => { return; };

        public Collider(Vector3[] vertices)
        {
            Min = new Vector3(float.MaxValue);
            Max = new Vector3(float.MinValue);

            foreach (var v in vertices)
            {
                Min = Vector3.ComponentMin(Min, v);
                Max = Vector3.ComponentMax(Max, v);
            }

        }

        public bool Intersects(Collider other)
        {
            return (Min.X <= other.Max.X && Max.X >= other.Min.X) &&
                   (Min.Y <= other.Max.Y && Max.Y >= other.Min.Y) &&
                   (Min.Z <= other.Max.Z && Max.Z >= other.Min.Z);
        }

    }
}
