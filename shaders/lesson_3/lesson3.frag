precision highp float;

uniform float time;
uniform float aspect;

varying vec2 vUv;

#pragma glslify: noise = require("glsl-noise/simplex/3d");
#pragma glslify: hslToRgb = require('glsl-hsl2rgb');


// varying vec2 vUv;
// void main(){

//   gl_FragColor = vec4(vec3(0.9, 0.4, 0.1), 1.0);
// }




void main(){

  // --- vec2 center = vUv - 0.5;
  vec2 center = vec2(vUv.x - 0.5, vUv.y - 0.5);
  
  float dist = length(center);

  float alpha = smoothstep(0.282, 0.28, dist + sin(time) * 0.1);

  // --- *0.5 + 0.5 makes n positive since noise goes from -1.0 to 1.0
  float n = noise(vec3(center * 1.9, time * 0.1)) * 0.5 + 0.5;
  
  vec3 color = hslToRgb(0.9, 0.5, n);

  center.y /= aspect;




  // gl_FragColor = vec4(vec3(n  + 0.2), 1.0);
  gl_FragColor = vec4(color, alpha);

}