precision highp float;

uniform float time;
uniform float aspect;

varying vec2 vUv;


void main(){
  vec3 green = vec3(vUv.xy, 0.5);

  gl_FragColor = vec4(green, 1.0);

}