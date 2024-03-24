import { getSiteUrl } from "./environment";
export const DEFAULT_SONG_IMAGE_URL = `${getSiteUrl()}/defaultSongCover.jpeg`;

const isValidImage = (
  image: Spotify.Image | undefined
): image is Pick<Spotify.Image, "url"> => {
  return !!(image?.url && image.url.trim() !== "");
};

const calculateDistance = (
  image: Spotify.Image,
  width: number,
  height?: number
) => {
  return (
    (image?.width ? Math.abs(image.width - width) : 0) +
    (height !== undefined && image?.height
      ? Math.abs(image.height - height)
      : 0)
  );
};

function findClosestImage(
  images: (Spotify.Image | undefined)[],
  targetWidth: number,
  targetHeight?: number
) {
  let closestValidImage: Spotify.Image | undefined;
  let closestDistance = Number.MAX_VALUE;

  for (const image of images) {
    if (
      closestValidImage?.url &&
      closestValidImage?.width &&
      closestValidImage?.width >= targetWidth &&
      image?.width &&
      image?.width < targetWidth
    ) {
      break;
    }

    if (isValidImage(image)) {
      const distance = calculateDistance(image, targetWidth, targetHeight);

      if (distance <= closestDistance && image?.width) {
        closestDistance = distance;
        closestValidImage = image;
      }
    }
  }

  return closestValidImage;
}

export function chooseImage(
  images: (Spotify.Image | undefined)[] | undefined,
  targetWidth: number,
  targetHeight?: number
): Spotify.Image {
  if (!images || images.length === 0) {
    return { url: DEFAULT_SONG_IMAGE_URL };
  }

  const closestValidImage = findClosestImage(images, targetWidth, targetHeight);

  if (closestValidImage) {
    return closestValidImage;
  } else {
    const imageWithUrl = images.find(isValidImage);
    if (imageWithUrl) return imageWithUrl;
  }

  return { url: DEFAULT_SONG_IMAGE_URL };
}
