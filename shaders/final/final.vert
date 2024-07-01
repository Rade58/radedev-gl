// I'm uing this vertex shader as a "placeholder"
// when practicing fragment shaders

varying vec2 vUv;
void main() {
  // uv is texture coordinates (a built in thing)
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
