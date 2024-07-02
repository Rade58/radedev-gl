varying vec2 vUv;
void main() {
  // uv is texture coordinates (a built in thing)
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}
