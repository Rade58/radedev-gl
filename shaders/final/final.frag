precision highp float;

uniform float time;
uniform float aspect;

// this represent texture coordinates
varying vec2 vUv;


void main(){
  vec3 col = vec3(0.9, vUv.yx + vec2(sin(time) * 0.6, sin(time) * 0.5));

  gl_FragColor = vec4(col, 1.0);

}