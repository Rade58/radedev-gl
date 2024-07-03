varying vec2 vUv;

// 
varying vec3 vPosition;


void main() {
  // uv is texture coordinates (a built in thing)
  vUv = uv;

  vPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}
