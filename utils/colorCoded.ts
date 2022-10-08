export function colorCodedToRGB(color: number): {
  r: number;
  g: number;
  b: number;
} {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  return { r, g, b };
}

export function colorCodedToHex(color: number): string {
  const r = (color >> 16) & 0xff;
  const g = (color >> 8) & 0xff;
  const b = color & 0xff;
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}
