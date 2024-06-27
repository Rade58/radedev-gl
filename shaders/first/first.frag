uniform float time;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(vUv.x, vUv.y, sin(time), 1.0);
}