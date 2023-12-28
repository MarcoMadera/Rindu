import { Dispatch, SetStateAction } from "react";

import { rgbToHex } from "utils";

const cache: Record<string, string> = {};

export function getMainColorFromImage(
  imageId: string,
  callback: Dispatch<SetStateAction<string>> | ((color: string) => void),
  config?: { dsx: number; dwy: number; dw: number; dh: number }
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
    canvas.width = image.width;
    canvas.height = image.height;
    if (config) {
      ctx.drawImage(image, config.dsx, config.dwy, config.dw, config.dh);
    } else {
      ctx.drawImage(image, 0, 0);
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
      getMainColorFromImage(imageId, callback, {
        dsx: 0,
        dwy: 0,
        dw: 1,
        dh: 1,
      });
      return;
    }

    if ((luma > 220 || luma < 30) && config) {
      callback("#7a7a7a");
      return;
    }
    const hex = rgbToHex(rgb);
    cache[img.src] = hex;
    callback(hex);
  };
}
