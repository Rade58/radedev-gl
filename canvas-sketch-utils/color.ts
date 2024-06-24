import { parseColor, style as sty } from "./misc/color/css-color";
import nm from "./misc/color/css-color-names.json";
import rgbLuminance from "./misc/color/relative-luminance";
import { HSLAToRGBA as hto, RGBAToHSLA as rgto } from "./misc/color/hsl";
import he from "./misc/color/hex-to-rgba";
import ra from "./misc/color/rgba-to-hex";

export const parse = parseColor;
export const style = sty;
export const names = nm;

export const HSLAToRGBA = hto;
export const RGBAToHSLA = rgto;
export const hexToRGBA = he;
export const RGBAToHex = ra;

export function relativeLuminance(color: string) {
  var result = parseColor(color);
  if (!result) return null;
  return rgbLuminance(result.rgb);
}

// Extracted from @tmcw / wcag-contrast
// https://github.com/tmcw/wcag-contrast
export function contrastRatio(colorA: string, colorB: string) {
  var a = relativeLuminance(colorA);
  var b = relativeLuminance(colorB);
  if (a == null || b == null) return null;
  var l1 = Math.max(a, b);
  var l2 = Math.min(a, b);
  return (l1 + 0.05) / (l2 + 0.05);
}

export function offsetHSL(color: string, h: number, s: number, l: number) {
  var result = parseColor(color);
  if (!result) return null;
  result.hsla[0] += h || 0;
  result.hsla[1] = Math.max(0, Math.min(100, result.hsla[1] + (s || 0)));
  result.hsla[2] = Math.max(0, Math.min(100, result.hsla[2] + (l || 0)));
  return parseColor({ hsla: result.hsla });
}

export function blend(background: string, foreground: string, opacity: number) {
  var bg = parseColor(background);
  var fg = parseColor(foreground);
  if (bg == null || fg == null) return null;

  var c0 = bg.rgba;
  var c1 = fg.rgba;
  opacity = typeof opacity === "number" && isFinite(opacity) ? opacity : 1.0;
  //@ts-expect-error some
  var alpha = opacity * c1[3];
  if (alpha >= 1) {
    // foreground is opaque so no blend required
    return fg;
  }
  for (var i = 0; i < 3; i++) {
    //@ts-expect-error some
    c1[i] = c1[i] * alpha + c0[i] * (c0[3] * (1 - alpha));
  }
  //@ts-expect-error some
  c1[3] = Math.max(0, Math.min(1, alpha + c0[3] * (1 - alpha)));
  return parseColor(c1); // re-parse to get new metadata
}
