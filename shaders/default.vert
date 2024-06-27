// I'm uing this vertex shader as a "placeholder"
// when practicing fragment shaders

varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
