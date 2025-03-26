varying vec3 rayDirection;
varying vec3 rayOrigin;

// point light
uniform vec3 light0;

struct Ray
{
  vec3    origin;
  vec3    direction;
};

struct Material
{
  vec3  diffuse;
  float   reflectance;
};


struct Hit
{
  vec3    position;
  vec3    normal;
  float   t;

  Material  material;
};

struct Sphere
{
  // coords + radius
  vec3    center;
  float   radius;
  Material  material;
};


// a small epsilon to work around the biggest problems with floats
const float EPS = 0.0001;
// 'clear value' for the ray 
const float START_T = 100000.0;
// maximum recursion depth for rays
const int MAX_DEPTH = 3;


Ray initRay()
{
  Ray r;
  r.origin = rayOrigin;
  r.direction = normalize(rayDirection);
  return r;
}

// intersects the ray with a sphere and returns the line parameter t for
// a hit or -1 if not hit occured
float intersectRaySphere(in Ray ray, in Sphere sphere)
{
  ...
}

// simplified ray-sphere hit test, returns true on a hit
bool intersectRaySphereOcclusion(in Ray ray, in Sphere sphere)
{
  ... 
}

// intersects the ray with the ground plane at Y=0 and returns the line
// parameter t where it hit
float intersectRayYPlane(in Ray ray)
{
  return -ray.origin.y / ray.direction.y;
}


// the scene consists of 7 spheres, a ground plane an a light
Sphere spheres[7];

// initializes the scene
void initScene()
{
  // set the center, radius and material of the first sphere
  spheres[0].center = vec3(0.0, 4.0, 0.0);
  spheres[0].radius = 2.0;
  spheres[0].material.diffuse = vec3(0.7, 0.0, 0.0);
  spheres[0].material.reflectance = 0.1;

  // and so on 
  ...
}


// traces the scene and reports the closest hit
bool traceScene(in Ray ray, inout Hit hit)
{


  hit.t = START_T;

  // first intersect the ground
  float t = intersectRayYPlane(ray);
  if (t >= 0.0 && t <= hit.t)
  {
    hit.t = t;
    hit.position = ray.origin + ray.direction * t;
    hit.normal = vec3(0,1,0);
    hit.material.diffuse  = vec3(0.6);
    hit.material.reflectance = 0.0;//05;
  }


  // then check each of the seven sphers
  for (int i = 0; i < 7; ++i)
  {
    t = intersectRaySphere(ray, spheres[i]);

    // only keep this hit if it's closer (smaller t)
    if (t >= 0.0 && t <= hit.t)
    {

      vec3 pos = ray.origin + ray.direction * t;; 
      vec3 N = normalize(pos - spheres[i].center);

      hit.t = t;
      hit.normal = N;
      hit.material = spheres[i].material;
      hit.position = pos;

    }
  }

  return hit.t < START_T;
}


// shades a given hit and returns the final color
vec3 shadeHit(in Hit hit)
{
  vec3 color = hit.material.diffuse;

  // ray to the light
  vec3 L = normalize(light0 - hit.position);

  // test for shadows
  Ray r;
  r.origin = hit.position + hit.normal * EPS;
  r.direction = L;

  // Phong shading with 0.2 min. ambient contribution. 
  float s = max(0.2, dot(L,hit.normal));

  for (int i = 0; i < 7; ++i)
    if (intersectRaySphereOcclusion(r, spheres[i]))
    {
      s = 0.2;
      break;
    } 
  color *= s;

  return color;
}


void main()
{

  // create the primary ray
  Ray ray = initRay();

  // create the scene
  initScene();

  // the 'clear color' is the ray direction (useful for debugging)
  vec3 color = ray.direction;


  Hit hit;
  // trace the scene and see if we hit something
  if (traceScene(ray, hit)) 
  {

    // if we do, shade the hit
    color = shadeHit(hit);


    // cannot use a while loop in glsl :( -- iterate for N recursions
    for (int i =0 ; i < MAX_DEPTH; ++i)
    {

      // add reflections if the material is reflective
      float r = hit.material.reflectance;
      if (r > 0.0)
      {

        vec3 R = reflect(ray.direction, hit.normal);
        ray.origin = hit.position + hit.normal * EPS;
        ray.direction = R;
        ray.depth += 1;


        vec3 color2;

        // again, trace the scene and shade the hit if successful
        if (traceScene(ray, hit))
          color2 = shadeHit(hit);
        else
          color2 = ray.direction;
        
        // add the color based on the reflection value
        color = mix(color, color2, r);
        
      }

    }

  }

  gl_FragColor = vec4(color, 1.0);

} 