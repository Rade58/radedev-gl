import names from "./css-color-names.json";
import { HSLAToRGBA, RGBAToHSLA } from "./hsl";
import hexToRGBA from "./hex-to-rgba";
import RGBAToHex from "./rgba-to-hex";
import wrap from "../wrap";

function parseStyle(str: string) {
  if (typeof str !== "string") {
    throw new TypeError(
      "Color parsing must be performed on a string parameter"
    );
  }

  str = str.toLowerCase();

  if (str in names) {
    str = (names as Record<string, string>)[str];
  } else if (str === "transparent") {
    str = "#00000000";
  }

  var rgba: number[] | null, hsla: number[], hex: string;
  if (/^#[a-f0-9]+$/.test(str)) {
    rgba = hexToRGBA(str);
    hex = RGBAToHex(rgba ? rgba : []);
    hsla = RGBAToHSLA(rgba ? rgba : []);
  } else {
    var match = /^((?:rgb|hsl)a?)\s*\(([^)]*)\)/.exec(str);
    if (!match) return null;
    var type = match[1].replace(/a$/, "");
    var parts: number[] = match[2]
      .replace(/^\s+|\s+$/g, "")
      .split(/\s*,\s*/)
      .map(function (n, i) {
        // opaque part
        if (i <= 2) return Math.round(parseFloat(n) || 0);
        // alpha part
        else {
          let o: number;

          o = parseFloat(n);
          if (typeof n !== "number" || !isFinite(n)) o = 1;
          return o;
        }
      });
    // fill in alpha with 1.0 by default
    if (typeof parts[3] === "undefined" || !isFinite(parts[3])) {
      parts[3] = 1;
    }
    if (type === "rgb") {
      hsla = RGBAToHSLA(parts);
      rgba = parts;
    } else if (type === "hsl") {
      rgba = HSLAToRGBA(parts);
      parts[0] = wrap(parts[0], 0, 360);
      hsla = parts;
    }
    // @ts-expect-error reason
    hex = RGBAToHex(rgba);
  }

  // @ts-expect-error reason
  if (!rgba && !hex && !hsla) return null;

  var ret = {
    hex: hex,
    // @ts-expect-error reason
    alpha: rgba[3],
    // @ts-expect-error reason
    rgb: rgba.slice(0, 3),
    // @ts-expect-error reason
    rgba: rgba,
    // @ts-expect-error reason
    hsl: hsla.slice(0, 3),
    // @ts-expect-error reason
    hsla: hsla,
  };

  return ret;
}

export function parseColor(color: string | any) {
  if (typeof color === "string") {
    return parseStyle(color);
  } else if (Array.isArray(color) && color.length >= 3) {
    var rgbStr = rgbStyle(color[0], color[1], color[2], color[3]);
    return parseStyle(rgbStr);
  } else if (color && typeof color === "object") {
    var str;
    if (color.hex) str = color.hex;
    else if (color.rgba)
      str = rgbStyle(
        color.rgba[0],
        color.rgba[1],
        color.rgba[2],
        color.rgba[3]
      );
    else if (color.hsla)
      str = hslStyle(
        color.hsla[0],
        color.hsla[1],
        color.hsla[2],
        color.hsla[3]
      );
    else if (color.rgb)
      str = rgbStyle(color.rgb[0], color.rgb[1], color.rgb[2]);
    else if (color.hsl)
      str = hslStyle(color.hsl[0], color.hsl[1], color.hsl[2]);
    if (str) return parseStyle(str);
  }
  return null;
}

export function style(color: string) {
  var result = parseColor(color);
  if (result) {
    var rgba = result.rgba;
    //@ts-expect-error some
    return rgbStyle(rgba[0], rgba[1], rgba[2], rgba[3]);
  }
  return null;
}

function rgbStyle(r: number, g: number, b: number, a?: number) {
  r = Math.max(0, Math.min(255, Math.round(r)));
  g = Math.max(0, Math.min(255, Math.round(g)));
  b = Math.max(0, Math.min(255, Math.round(b)));
  // @ts-expect-error reason
  if (a === 1 || !isFinite(a) || typeof a === "undefined") {
    return "rgb(" + [r, g, b].join(", ") + ")";
  } else {
    a = Math.max(0, Math.min(1, a));
    return "rgba(" + [r, g, b, a].join(", ") + ")";
  }
}

function hslStyle(h: number, s: number, l: number, a?: number) {
  h = wrap(h, 0, 360);
  h = Math.max(0, Math.min(360, Math.round(h)));
  s = Math.max(0, Math.min(100, Math.round(s)));
  l = Math.max(0, Math.min(100, Math.round(l)));
  // @ts-expect-error
  if (a === 1 || !isFinite(a) || typeof a === "undefined") {
    return "hsl(" + [h, s, l].join(", ") + ")";
  } else {
    a = Math.max(0, Math.min(1, a));
    return "hsla(" + [h, s, l, a].join(", ") + ")";
  }
}
