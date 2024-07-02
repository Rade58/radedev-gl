precision highp float;


// this represent texture coordinates
varying vec2 vUv;

// uniform passed as Color instance, bcause
// Color instance from Three is also a Vector3
uniform float aspect;
uniform vec3 color;
uniform float time;
uniform float stretch;


#pragma glslify: noise = require(glsl-noise/simplex/3d);

void main(){
  // vec3 col = vec3(vUv.y, time * 0.2, vUv.x);
  
  // 
  vec2 center = vec2(0.5, 0.5);
  
  // 
  vec2 q = vUv;

  q.x *= 2.0;

  // ------ making more circles ------
  //  8 * 8 circles on every side (64 circles) 
  // vec2 pos = mod(vUv * 8.0, 1.0);
  vec2 pos = mod(q * 10.0, 1.0);
  // float d = distance(vUv, center);
  float d = distance(pos, center);
  // ----------------------------------------------------

  
  
  vec2 noiseInput = q * 10.0;
  
  
  // ------ creting mask (you'll have sharp line between color) ------
  // never use ternary, use step instead
  // float mask = d > 0.25 ? 1.0 : 0.0;
  // float mask = step(0.25, d);  // 0.25 number will be size of the circle, try changing
  // float offset = noise(vec3(vUv.xy, sin(time * 0.6)));
  float offset = noise(vec3(noiseInput.xy, sin(time * 0.6))) * 0.6;
  
  float mask = step(0.14  + offset, d);
   



  mask = 1.0 - mask;
  // ----------------------------------------------------

  // interpolated color
  // vec3 interpolated = mix(color, vec3(1.0, sin(0.2 * time), 0.2), mask);
  vec3 interpolated = mix(color, vec3(0.9, 0.4 * vUv.x, 0.7), mask);


  // gl_FragColor = vec4(vec3(vUv.y * 0.2 + cos(time), vUv.x * 0.2 + sin(time), vUv.y * 0.3) * color, 1.0);
  // gl_FragColor = vec4(vec3(mask), 1.0);
  
  gl_FragColor = vec4(vec3(interpolated), 1.0);

}