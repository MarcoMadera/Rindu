function srgbToLinear(channel: number) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToXyz(r: number, g: number, b: number) {
  r = srgbToLinear(r);
  g = srgbToLinear(g);
  b = srgbToLinear(b);

  return {
    x: r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
    y: r * 0.2126729 + g * 0.7151522 + b * 0.072175,
    z: r * 0.0193339 + g * 0.119192 + b * 0.9503041,
  };
}

function xyzToLab(x: number, y: number, z: number) {
  const white = { x: 0.95047, y: 1.0, z: 1.08883 };

  x /= white.x;
  y /= white.y;
  z /= white.z;

  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : (903.3 * t + 16) / 116;

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

function labToLch({ l, a, b }: { l: number; a: number; b: number }) {
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * (180 / Math.PI);
  if (h < 0) h += 360;

  return { l, c, h };
}

function lchToOklch({ l, c, h }: { l: number; c: number; h: number }) {
  return {
    l: l / 100,
    c: c / 100,
    h: h,
  };
}

export function rgbToOklch(
  r: number,
  g: number,
  b: number
): { l: number; c: number; h: number } {
  const xyz = rgbToXyz(r, g, b);
  const lab = xyzToLab(xyz.x, xyz.y, xyz.z);
  const lch = labToLch(lab);
  return lchToOklch(lch);
}
