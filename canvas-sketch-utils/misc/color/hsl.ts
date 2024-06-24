// @ts-expect-error no types
import floatHSL2RGB from "float-hsl2rgb";
// @ts-expect-error no types
import floatRGB2HSL from "float-rgb2hsl";

var wrap = require("./wrap");

export function RGBAToHSLA(rgba: number[]) {
  var floatHSL: number[] = floatRGB2HSL([
    rgba[0] / 255,
    rgba[1] / 255,
    rgba[2] / 255,
  ]);
  return [
    Math.max(0, Math.min(360, Math.round(floatHSL[0] * 360))),
    Math.max(0, Math.min(100, Math.round(floatHSL[1] * 100))),
    Math.max(0, Math.min(100, Math.round(floatHSL[2] * 100))),
    rgba[3],
  ];
}

export function HSLAToRGBA(hsla: number[]) {
  var hue = wrap(hsla[0], 0, 360);
  var floatRGB: number[] = floatHSL2RGB([
    hue / 360,
    hsla[1] / 100,
    hsla[2] / 100,
  ]);
  return [
    Math.max(0, Math.min(255, Math.round(floatRGB[0] * 255))),
    Math.max(0, Math.min(255, Math.round(floatRGB[1] * 255))),
    Math.max(0, Math.min(255, Math.round(floatRGB[2] * 255))),
    hsla[3],
  ];
}
