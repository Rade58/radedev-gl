precision highp float;

// this is already declared by default so comment it out
// attribute vec3 position;
// uniform mat4 projectionMatrix;
// uniform mat4 modelViewMatrix;

uniform float stretch;

varying vec2 vUv;


void main(){

  vUv = uv;


  vec3 transformed = position.xyz;

  transformed.xz *= sin(position.y + stretch);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

}