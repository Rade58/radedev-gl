precision highp float;

uniform float time;
uniform float aspect;

varying vec2 vUv;

#pragma glslify: noise = require("glsl-noise/simplex/3d");

void main(){

  vec2 center = vUv - 0.5;

  center.y /= aspect;


  float n = noise(vec3(center * 1.9, time * 0.1));


  gl_FragColor = vec4(vec3(n  + 0.2), 1.0);

}