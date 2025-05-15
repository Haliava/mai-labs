using System;
using System.Collections.Generic;
using System.Linq;
using OpenTK.Mathematics;
using System.Text;
using System.Threading.Tasks;

namespace KGBase.Primitives
{
    class Object
    {
        public Figure _figure { get; set; }
        public Collider _collider { get; set; }
        public Vector3 Velocity { get; set; } = new Vector3();
        public ObjectState _state { get; set; }
        public ObjectType _type { get; set; }
        public List<Object> _objects { get; set; }

        public Object(Figure figure) { 
            this._collider = new Collider(figure.getVertices());
            this._figure = figure;
        }

        public void Draw(double timeElapsed, List<Light> lights, Camera camera, float wh)
        {
            if (_state == ObjectState.dead)
                return;

            this._figure.coordinates += Velocity * (float)timeElapsed;
            this._collider.Min += Velocity * (float)timeElapsed;
            this._collider.Max += Velocity * (float)timeElapsed;

            this._figure.Draw(lights, camera, wh);

            foreach(Object obj in _objects)
            {
                if (obj == this)
                    continue;
                if (obj._collider.Intersects(_collider) && obj._state != ObjectState.dead)
                {
                    _collider.intersectAction(obj);
                    obj._collider.intersectAction(this);
                }
            }

        }

        public enum ObjectState
        {
            active,
            dead
        }

        public enum ObjectType
        {
            obj,
            bullet,
            platform
        }

    }
}
