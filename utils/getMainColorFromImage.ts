function getAverageRGB(imageData: ImageData | undefined) {
  if (!imageData) {
    return { r: 0, g: 0, b: 0 };
  }
  const data = imageData.data;
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  r = Math.floor(r / (data.length / 4));
  g = Math.floor(g / (data.length / 4));
  b = Math.floor(b / (data.length / 4));
  return { r, g, b };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function getMainColorFromImage(imageId: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = document.querySelector(`#${imageId}`) as HTMLImageElement;
  if (!img) {
    return;
  }
  img.crossOrigin = "Anonymous";
  canvas.width = img.width;
  canvas.height = img.height;
  ctx?.drawImage(img, 0, 0);
  const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  const rgb = getAverageRGB(imageData);
  var luma = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;

  if (luma < 30) {
    return "#181818";
  }
  const hex = rgbToHex(rgb);
  return hex;
}
