import { Dispatch, SetStateAction } from "react";

import { rgbToHex } from "utils";

const cache: Record<string, string> = {};

export function getMainColorFromImage(
  imageId: string,
  callback: Dispatch<SetStateAction<string>> | ((color: string) => void),
  config?: { sampleSize?: number; qualityReduction?: number },
  document: Document = window.document
): void {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = document.querySelector(`#${imageId}`) as HTMLImageElement;
  if (!img || !ctx) {
    return;
  }

  if (cache[img.src]) {
    callback(cache[img.src]);
    return;
  }

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = img.src;
  image.onload = () => {
    const sampleSize = config?.sampleSize || 100;
    const qualityReduction = config?.qualityReduction || 10;

    const scaledWidth = Math.max(1, Math.floor(image.width / qualityReduction));
    const scaledHeight = Math.max(
      1,
      Math.floor(image.height / qualityReduction)
    );
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

    const imageData = ctx.getImageData(0, 0, scaledWidth, scaledHeight).data;

    const colorCounts: Record<string, number> = {};
    const colorValues: Record<string, { r: number; g: number; b: number }> = {};

    for (let i = 0; i < sampleSize; i++) {
      const randomIndex =
        Math.floor(Math.random() * (scaledWidth * scaledHeight)) * 4;

      if (imageData[randomIndex + 3] === 0) continue;

      const r = imageData[randomIndex];
      const g = imageData[randomIndex + 1];
      const b = imageData[randomIndex + 2];

      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (luma > 240 || luma < 15) continue;

      const simplifiedR = Math.floor(r / 8) * 8;
      const simplifiedG = Math.floor(g / 8) * 8;
      const simplifiedB = Math.floor(b / 8) * 8;

      const colorKey = `${simplifiedR},${simplifiedG},${simplifiedB}`;

      if (!colorCounts[colorKey]) {
        colorCounts[colorKey] = 0;
        colorValues[colorKey] = { r, g, b };
      }

      colorCounts[colorKey]++;
    }

    let dominantColorKey = Object.keys(colorCounts)[0];
    let maxCount = 0;

    for (const colorKey in colorCounts) {
      if (colorCounts[colorKey] > maxCount) {
        maxCount = colorCounts[colorKey];
        dominantColorKey = colorKey;
      }
    }

    let dominantColor = { r: 122, g: 122, b: 122 };

    if (dominantColorKey) {
      dominantColor = colorValues[dominantColorKey];
    }

    const hex = rgbToHex(dominantColor);

    cache[img.src] = hex;

    callback(hex);
  };
}
