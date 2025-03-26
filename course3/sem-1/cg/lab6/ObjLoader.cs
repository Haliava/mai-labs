using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KGBase.Primitives;
using KGBase.Resourses;
using OpenTK.Mathematics;

namespace KGBase
{
    public class ObjLoader
    {
        public float[] Vertices;
        public int[] Indices;
        public int VertexCount;
        public int IndexCount;

        public ObjLoader(string path)
        {
            List<float> verticesList = new List<float>();
            List<int> indicesList = new List<int>();
            Dictionary<string, uint> uniqueVertices = new Dictionary<string, uint>();

            try
            {
                using (StreamReader sr = new StreamReader(path))
                {
                    string line;
                    List<Vector3> tempVertices = new List<Vector3>();
                    List<Vector3> tempNormals = new List<Vector3>();

                    // Сначала читаем все вершины и нормали
                    while ((line = sr.ReadLine()) != null)
                    {
                        string[] tokens = line.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

                        if (tokens.Length == 0 || tokens[0].StartsWith("#"))
                            continue;

                        switch (tokens[0])
                        {
                            case "v": // Вершины
                                tempVertices.Add(new Vector3(
                                    float.Parse(tokens[1], CultureInfo.InvariantCulture),
                                    float.Parse(tokens[2], CultureInfo.InvariantCulture),
                                    float.Parse(tokens[3], CultureInfo.InvariantCulture)
                                ));
                                break;

                            case "vn": // Нормали
                                tempNormals.Add(new Vector3(
                                    float.Parse(tokens[1], CultureInfo.InvariantCulture),
                                    float.Parse(tokens[2], CultureInfo.InvariantCulture),
                                    float.Parse(tokens[3], CultureInfo.InvariantCulture)
                                ));
                                break;
                        }
                    }

                    sr.BaseStream.Position = 0;
                    sr.DiscardBufferedData();

                    while ((line = sr.ReadLine()) != null)
                    {
                        string[] tokens = line.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

                        if (tokens.Length == 0 || tokens[0].StartsWith("#"))
                            continue;

                        if (tokens[0] == "f")
                        {
                            int vertexCount = tokens.Length - 1;

                            int[] faceIndices = new int[vertexCount];

                            for (int i = 0; i < vertexCount; i++)
                            {
                                string[] vertexData = tokens[i + 1].Split('/');

                                int vertexIndex = int.Parse(vertexData[0]) - 1;
                                Vector3 position = tempVertices[vertexIndex];

                                Vector3 normal = new Vector3(0, 0, 0);
                                if (vertexData.Length > 2 && vertexData[2] != "")
                                {
                                    int normalIndex = int.Parse(vertexData[2]) - 1;
                                    normal = tempNormals[normalIndex];
                                }


                                string key = $"{vertexIndex}/{vertexData[2]}";

                                uint index;
                                if (uniqueVertices.TryGetValue(key, out index))
                                {
                                    faceIndices[i] = (int)index;
                                }
                                else
                                {
                                    index = (uint)(verticesList.Count / 6);
                                    uniqueVertices.Add(key, index);

                                    verticesList.Add(position.X);
                                    verticesList.Add(position.Y);
                                    verticesList.Add(position.Z);

                                    verticesList.Add(normal.X);
                                    verticesList.Add(normal.Y);
                                    verticesList.Add(normal.Z);

                                    faceIndices[i] = (int)index;
                                }
                            }

                            // Триангуляция грани (если грань представляет собой многоугольник)
                            for (int i = 1; i < vertexCount - 1; i++)
                            {
                                indicesList.Add((int)faceIndices[0]);
                                indicesList.Add((int)faceIndices[i]);
                                indicesList.Add((int)faceIndices[i + 1]);
                            }
                        }
                    }

                    Vertices = verticesList.ToArray();
                    Indices = indicesList.ToArray();
                    VertexCount = Vertices.Length / 6; // Каждая вершина состоит из 6 компонентов
                    IndexCount = Indices.Length;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при загрузке модели: {ex.Message}");
            }
        }
    }
}
