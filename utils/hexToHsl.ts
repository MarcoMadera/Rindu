export function hexToHsl<T extends boolean>(
  hex: string,
  valuesOnly?: T
): (T extends true ? number[] : string) | null;
export function hexToHsl(
  hex: string,
  valuesOnly?: boolean
): number[] | string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    if (h) {
      h /= 6;
    }
  }

  h = h ? Math.round(h * 360) : 0;
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  const hslArray = [h, s, l];
  const hslString = `hsl(${h}, ${s}%, ${l}%)`;

  if (valuesOnly) {
    return hslArray;
  }

  return hslString;
}
