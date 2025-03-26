using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenTK.Mathematics;

namespace KGBase.Primitives
{
    class SpotLight : Light
    {

        public Vector3 Direction = new Vector3(1, 0, 0);
        public float cutOff = MathF.Cos(MathHelper.DegreesToRadians(12.5f));
        public float outerCutOff = MathF.Cos(MathHelper.DegreesToRadians(17.5f));
        public float constant = 1.0f;
        public float linear = 0.09f;
        public float quadratic = 0.032f;
        private Cube cube = new Cube([1, 1, 1, 1], Window.lightShader);

        public override void Draw(Camera camera, float wh)
        {

            this.cube.scale = new Vector3(0.2f, 0.2f, 0.2f);
            this.cube.coordinates = this.Position;
            this.cube.isLight = true;

            this.cube.setColors([this.Color.X, this.Color.Y, this.Color.Z, 1]);
            this.cube.Draw([], camera, wh);

        }
    }
}
