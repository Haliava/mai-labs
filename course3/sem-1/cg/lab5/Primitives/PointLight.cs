using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenTK.Mathematics;

namespace KGBase.Primitives
{
    class PointLight : Light
    {

        public float constant = 1.0f;
        public float linear = 0.09f;
        public float quadratic = 0.032f;
        private Cube cube = new Cube([1, 1, 1, 1], Window.lightShader);

        public override void Draw(Camera camera, float wh){

            this.cube.scale = new Vector3(0.2f, 0.2f, 0.2f);
            this.cube.coordinates = this.Position;
            this.cube.isLight = true;

            this.cube.setColors([this.Color.X, this.Color.Y, this.Color.Z, 1]);
            this.cube.Draw([], camera, wh);

        }
    }
}
