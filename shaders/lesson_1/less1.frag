precision highp float;

uniform float time;
uniform float aspect;


varying vec2 vUv;

void main(){
  // vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(0.0, 2.0, 4.0));
  // gl_FragColor = vec4(color, 1.0);

  // vec3 color = vec3(vUv.x, sin(time) + 0.2, 0.8);

  vec3 colorA = sin(time * 0.1 * 3.14) + vec3(0.7, 0.6, 0.1);
  // vec3 colorA = cos( time * 0.1 + vUv.xyx + vec3(0.6, 0.4, 0.5));
  vec3 colorB = vec3(0.6, 0.2, 1.0);
  // vec3 colorB = sin( time * 0.2 + vUv.xyx + vec3(1.0, 0.4, 0.5));

  vec2 center = vec2(vUv.x - 0.5, vUv.y - 0.5);

  // nope, looks terrible
  center.x /= aspect - 0.2;
  center.y /= aspect - 0.2;

  float dist = length(center);

  // float alpha = 1.0;
  // float alpha = step(dist, sin(time * 0.1 * 3.14));
  float alpha = smoothstep(0.3, 0.25, dist + sin(time) * 0.1);

  vec3 colorMix = mix(colorA, colorB, vUv.xyx + 0.2);

  // gl_FragColor = vec4(colorMix, dist < 0.25 ? 1.0 : 0.0 );
  gl_FragColor = vec4(colorMix, alpha );

}