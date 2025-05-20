function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function rgbToLms(
  r: number,
  g: number,
  b: number
): { l: number; m: number; s: number } {
  return {
    l: 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b,
    m: 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
    s: 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b,
  };
}

function lmsToCubeRoot(lms: { l: number; m: number; s: number }): {
  l_: number;
  m_: number;
  s_: number;
} {
  return {
    l_: Math.cbrt(lms.l),
    m_: Math.cbrt(lms.m),
    s_: Math.cbrt(lms.s),
  };
}

function cubeRootLmsToOklab(lms: { l_: number; m_: number; s_: number }): {
  L: number;
  A: number;
  B: number;
} {
  return {
    L: 0.2104542553 * lms.l_ + 0.793617785 * lms.m_ - 0.0040720468 * lms.s_,
    A: 1.9779984951 * lms.l_ - 2.428592205 * lms.m_ + 0.4505937099 * lms.s_,
    B: 0.0259040371 * lms.l_ + 0.7827717662 * lms.m_ - 0.808675766 * lms.s_,
  };
}

function oklabToOklch(lab: { L: number; A: number; B: number }): {
  l: number;
  c: number;
  h: number;
} {
  const C = Math.sqrt(lab.A * lab.A + lab.B * lab.B);
  let H = Math.atan2(lab.B, lab.A) * (180 / Math.PI);
  if (H < 0) H += 360;

  return { l: lab.L, c: C, h: H };
}

export function rgbToOklch(
  r: number,
  g: number,
  b: number
): { l: number; c: number; h: number } {
  const linearR = srgbToLinear(r);
  const linearG = srgbToLinear(g);
  const linearB = srgbToLinear(b);

  const lms = rgbToLms(linearR, linearG, linearB);
  const lmsCube = lmsToCubeRoot(lms);
  const oklab = cubeRootLmsToOklab(lmsCube);

  return oklabToOklch(oklab);
}
