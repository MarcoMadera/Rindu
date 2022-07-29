interface IHexToRgb {
  r: number;
  g: number;
  b: number;
}

export function rgbToHex({ r, g, b }: IHexToRgb): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
