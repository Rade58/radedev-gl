import wrap from "./misc/wrap";
import defined from "defined";

var EPSILON = Number.EPSILON;

function clamp(value: number, min: number, max: number) {
  return min < max
    ? value < min
      ? min
      : value > max
      ? max
      : value
    : value < max
    ? max
    : value > min
    ? min
    : value;
}

function clamp01(v: number) {
  return clamp(v, 0, 1);
}

function lerp(min: number, max: number, t: number) {
  return min * (1 - t) + max * t;
}

function inverseLerp(min: number, max: number, t: number) {
  if (Math.abs(min - max) < EPSILON) return 0;
  else return (t - min) / (max - min);
}

function smoothstep(min: number, max: number, t: number) {
  var x = clamp(inverseLerp(min, max, t), 0, 1);
  return x * x * (3 - 2 * x);
}

function toFinite(n: number, defaultValue: number) {
  defaultValue = defined(defaultValue, 0);
  return typeof n === "number" && isFinite(n) ? n : defaultValue;
}

function expandVector(dims: number) {
  if (typeof dims !== "number") throw new TypeError("Expected dims argument");
  return function (p: number[] | number | null, defaultValue: number) {
    defaultValue = defined(defaultValue, 0);
    var scalar;
    if (p === null) {
      // No vector, create a default one
      scalar = defaultValue;
    } else if (typeof p === "number" && isFinite(p)) {
      // Expand single channel to multiple vector
      scalar = p;
    }

    var out = [];
    var i;
    if (scalar === null) {
      for (i = 0; i < dims; i++) {
        if (p && typeof p !== "number") {
          out[i] = toFinite(p[i], defaultValue);
        }
      }
    } else {
      for (i = 0; i < dims; i++) {
        out[i] = scalar;
      }
    }
    return out;
  };
}

function lerpArray(min: number[], max: number[], t: number, out: number[]) {
  out = out || [];
  if (min.length !== max.length) {
    throw new TypeError(
      "min and max array are expected to have the same length"
    );
  }
  for (var i = 0; i < min.length; i++) {
    out[i] = lerp(min[i], max[i], t);
  }
  return out;
}

function newArray(n: number, initialValue?: number) {
  n = defined(n, 0);
  if (typeof n !== "number")
    throw new TypeError("Expected n argument to be a number");
  var out = [];
  for (var i = 0; i < n; i++) out.push(initialValue);
  return out;
}

function linspace(n: number, opts?: { offset?: number; endpoint?: boolean }) {
  n = defined(n, 0);
  if (typeof n !== "number")
    throw new TypeError("Expected n argument to be a number");
  opts = opts || {};
  if (typeof opts === "boolean") {
    opts = { endpoint: true };
  }
  var offset = defined(opts.offset, 0);
  if (opts.endpoint) {
    return newArray(n).map(function (_, i) {
      return n <= 1 || offset === undefined ? 0 : (i + offset) / (n - 1);
    });
  } else {
    return newArray(n).map(function (_, i) {
      return (i + (offset !== undefined ? offset : 0)) / n;
    });
  }
}

function lerpFrames(values: number[], t: number, out: number[]) {
  t = clamp(t, 0, 1);

  var len = values.length - 1;
  var whole = t * len;
  var frame = Math.floor(whole);
  var fract = whole - frame;

  var nextFrame = Math.min(frame + 1, len);
  var a = values[frame % values.length];
  var b = values[nextFrame % values.length];
  if (typeof a === "number" && typeof b === "number") {
    return lerp(a, b, fract);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    return lerpArray(a, b, fract, out);
  } else {
    throw new TypeError(
      "Mismatch in value type of two array elements: " +
        frame +
        " and " +
        nextFrame
    );
  }
}

function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

function degToRad(n: number) {
  return (n * Math.PI) / 180;
}

function radToDeg(n: number) {
  return (n * 180) / Math.PI;
}

function fract(n: number) {
  return n - Math.floor(n);
}

function sign(n: number) {
  if (n > 0) return 1;
  else if (n < 0) return -1;
  else return 0;
}

// Specific function from Unity / ofMath, not sure its needed?
// function lerpWrap (a, b, t: number, min, max) {
//   return wrap(a + wrap(b - a, min, max) * t, min, max)
// }

function pingPong(t: number, length: number) {
  t = mod(t, length * 2);
  return length - Math.abs(t - length);
}

function damp(a: number, b: number, lambda: number, dt: number) {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

function dampArray(
  a: number[],
  b: number[],
  lambda: number,
  dt: number,
  out: number[]
) {
  out = out || [];
  for (var i = 0; i < a.length; i++) {
    out[i] = damp(a[i], b[i], lambda, dt);
  }
  return out;
}

function mapRange(
  value: number,
  inputMin: number,
  inputMax: number,
  outputMin: number,
  outputMax: number,
  clamp: number
) {
  // Reference:
  // https://openframeworks.cc/documentation/math/ofMath/
  if (Math.abs(inputMin - inputMax) < EPSILON) {
    return outputMin;
  } else {
    var outVal =
      ((value - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
      outputMin;
    if (clamp) {
      if (outputMax < outputMin) {
        if (outVal < outputMax) outVal = outputMax;
        else if (outVal > outputMin) outVal = outputMin;
      } else {
        if (outVal > outputMax) outVal = outputMax;
        else if (outVal < outputMin) outVal = outputMin;
      }
    }
    return outVal;
  }
}

const funks = {
  mod: mod,
  fract: fract,
  sign: sign,
  degToRad: degToRad,
  radToDeg: radToDeg,
  wrap: wrap,
  pingPong: pingPong,
  linspace: linspace,
  lerp: lerp,
  lerpArray: lerpArray,
  inverseLerp: inverseLerp,
  lerpFrames: lerpFrames,
  clamp: clamp,
  clamp01: clamp01,
  smoothstep: smoothstep,
  damp: damp,
  dampArray: dampArray,
  mapRange: mapRange,
  expand2D: expandVector(2),
  expand3D: expandVector(3),
  expand4D: expandVector(4),
};

export default funks;
