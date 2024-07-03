precision highp float;

uniform float time;
uniform float aspect;

// uniform float POINT_COUNT;

// this represent texture coordinates
varying vec2 vUv;

// uniform passed as Color instance, bcause
// Color instance from Three is also a Vector3
uniform vec3 color;

void main(){
  // vec3 col = vec3(vUv.y, time * 0.2, vUv.x);

  // gl_FragColor = vec4(vec3(vUv.y * 0.2 + cos(time), vUv.x * 0.2 + sin(time), vUv.y * 0.3) * color, 1.0);

  gl_FragColor = vec4(vec3(sin(time * 0.2), 0.4, 0.1), 1.0);

}