using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using KGBase.Primitives;
using OpenTK.Mathematics;

namespace KGBase
{
    class RayTracer
    {
        private List<Figure> figures;
        private List<Light> lights;
        private Camera camera;
        private int width, height;
        private Vector3 fogColor = new Vector3(0.5f, 0.5f, 0.5f); // Цвет тумана
        private float fogDensity = 0.1f;

        public RayTracer(List<Figure> figures, List<Light> lights, Camera camera, int width, int height)
        {
            this.figures = figures;
            this.lights = lights;
            this.camera = camera;
            this.width = width;
            this.height = height;
        }

        public void Render(string outputPath)
        {
            Bitmap image = new Bitmap(width, height);

            for (int y = 0; y < height; y++)
            {
                for (int x = 0; x < width; x++)
                {
                    // Нормализованные координаты пикселя в экранном пространстве
                    float u = (float)x / (width - 1) * 2 - 1;
                    float v = (float)y / (height - 1) * 2 - 1;
                    u *= camera.AspectRatio;
                    v *= 1;

                    // Генерация луча
                    Ray ray = camera.GetRay(u, v);
                    Vector3 color = TraceRay(ray, 0);

                    // Перевод цвета в формат RGB
                    image.SetPixel(x, y, ColorFromVector(color));
                }
            }

            image.Save(outputPath);
        }

        private Vector3 TraceRay(Ray ray, int depth)
        {
            if (depth > 5) return fogColor; // Ограничение глубины трассировки

            HitRecord hit = FindNearestIntersection(ray);
            if (hit != null)
            {
                // Вычисление рассеяния и поглощения
                Vector3 color = ApplyLighting(hit, ray);

                // Добавление объемных эффектов
                color = Vector3.Lerp(color, fogColor, 1 - MathF.Exp(-fogDensity * hit.Distance));

                return color;
            }

            return fogColor; // Цвет фона
        }

        private HitRecord FindNearestIntersection(Ray ray)
        {
            HitRecord nearestHit = null;
            foreach (var figure in figures)
            {
                HitRecord hit = figure.Intersect(ray);
                if (hit != null && (nearestHit == null || hit.Distance < nearestHit.Distance))
                {
                    nearestHit = hit;
                }
            }
            return nearestHit;
        }

        private Vector3 ApplyLighting(HitRecord hit, Ray ray)
        {
            Vector3 color = Vector3.Zero;
            foreach (var light in lights)
            {
                Vector3 lightDir = Vector3.Normalize(light.Position - hit.Point);
                float diffuse = MathF.Max(Vector3.Dot(hit.Normal, lightDir), 0);
                color += diffuse * light.Color;
            }
            return color * hit.Color;
        }

        private Color ColorFromVector(Vector3 vector)
        {
            int r = (int)(MathF.Clamp(vector.X, 0, 1) * 255);
            int g = (int)(MathF.Clamp(vector.Y, 0, 1) * 255);
            int b = (int)(MathF.Clamp(vector.Z, 0, 1) * 255);
            return Color.FromArgb(r, g, b);
        }
    }

    class Ray
    {
        public Vector3 Origin;
        public Vector3 Direction;

        public Ray(Vector3 origin, Vector3 direction)
        {
            Origin = origin;
            Direction = direction;
        }
    }

    class HitRecord
    {
        public Vector3 Point;
        public Vector3 Normal;
        public Vector3 Color;
        public float Distance;

        public HitRecord(Vector3 point, Vector3 normal, Vector3 color, float distance)
        {
            Point = point;
            Normal = normal;
            Color = color;
            Distance = distance;
        }
    }
}
