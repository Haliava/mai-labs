using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KGBase.Primitives
{
    class Scene
    {
        private List<Object> objects = new List<Object>();
        private List<Light> lights = new List<Light>();

        public List<Object> getObjects()
        {
            return objects;
        }

        public void addObject(Object obj)
        {
            objects.Add(obj);
            obj._objects = objects;
        }

        public void addLight(Light light)
        {
            lights.Add(light);
        }

        public void Draw(double timeElapsed, Camera camera, float wh)
        {
            foreach (Object obj in objects)
            {
                obj.Draw(timeElapsed, lights, camera, wh);
            }
            foreach (Light light in lights)
            {
                light.Draw(camera, wh);
            }
        }
    }
}
