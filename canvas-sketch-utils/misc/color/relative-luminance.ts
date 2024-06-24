var rc = 0.2126;
var gc = 0.7152;
var bc = 0.0722;
// low-gamma adjust coefficient
var lowc = 1 / 12.92;

function adjustGamma(a: number) {
  return Math.pow((a + 0.055) / 1.055, 2.4);
}

export default function relativeLuminance(rgb: number[]) {
  var rsrgb = rgb[0] / 255;
  var gsrgb = rgb[1] / 255;
  var bsrgb = rgb[2] / 255;
  var r = rsrgb <= 0.03928 ? rsrgb * lowc : adjustGamma(rsrgb);
  var g = gsrgb <= 0.03928 ? gsrgb * lowc : adjustGamma(gsrgb);
  var b = bsrgb <= 0.03928 ? bsrgb * lowc : adjustGamma(bsrgb);
  return r * rc + g * gc + b * bc;
}
