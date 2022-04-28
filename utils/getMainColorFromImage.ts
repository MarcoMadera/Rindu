function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function getMainColorFromImage(
  imageId: string,
  config?: { dsx: number; dwy: number; dw: number; dh: number }
): string | undefined {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = document.querySelector(`#${imageId}`) as HTMLImageElement;
  if (!img || !ctx) {
    return;
  }
  img.crossOrigin = "Anonymous";
  canvas.width = img.width;
  canvas.height = img.height;
  if (config) {
    ctx.drawImage(img, config.dsx, config.dwy, config.dw, config.dh);
  } else {
    ctx.drawImage(img, 0, 0);
  }
  const imageData = ctx.getImageData(
    config?.dsx ?? 0,
    config?.dwy ?? 0,
    canvas.width,
    canvas.height
  ).data;
  const rgb = { r: imageData[0], g: imageData[1], b: imageData[2] };
  const luma = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;

  if ((luma > 220 || luma < 30) && !config) {
    return getMainColorFromImage(imageId, { dsx: 0, dwy: 0, dw: 1, dh: 1 });
  }

  if ((luma > 220 || luma < 28) && config) {
    return "#7a7a7a";
  }
  const hex = rgbToHex(rgb);
  return hex;
}
