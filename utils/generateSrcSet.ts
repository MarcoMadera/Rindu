export function generateSrcSet(images: Spotify.Image[]): string {
  return images
    .filter((image) => image.url && image.width)
    .map((image) => `${image.url} ${image.width}w`)
    .join(", ");
}
