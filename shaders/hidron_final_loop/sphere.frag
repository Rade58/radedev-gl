precision highp float;

#define PI 3.14;

uniform float time;
uniform float aspect;

// defined in vertex shader
varying vec3 vPosition;

// declared by glsl when we passed a #define
// can't declare it here, it will create error
// #define int POINT_COUNT;

// no idea why we write it like this, but this will allow
// us to use loop
uniform vec3 points[POINT_COUNT];


// this represent texture coordinates
varying vec2 vUv;

// we passed uniform as Color instance, bcause
// Color instance from Three is also a Vector3
uniform vec3 color;

uniform vec3 point;


void main(){

  float dist = 10000.0;


  for ( int i = 0; i < POINT_COUNT; i++) {
    vec3 p = points[i];
   
    // vPoition is defined in vertex shader but we declared here also
   
    float d = distance(vPosition, p);

    dist = min(d, dist);

  }


  float mask = step(0.16, dist);
  mask = 1.0 - mask;



  // vec3 col = vec3(vUv.y, time * 0.2, vUv.x);

  // gl_FragColor = vec4(vec3(vUv.y * 0.2 + cos(time), vUv.x * 0.2 + sin(time), vUv.y * 0.3) * color, 1.0);

  // gl_FragColor = vec4(vec3(mask), 1.0);
  // gl_FragColor = vec4(vec3(0.5), 1.0);


  // gl_FragColor = vec4(vec3(mask), 1.0);

  vec3 fragColor = mix(color, vec3(1.0), mask);

  gl_FragColor = vec4(vec3(fragColor), 1.0);

}