export async function callPictureInPicture(
  pictureInPictureCanvas: HTMLCanvasElement,
  video: HTMLVideoElement
): Promise<void> {
  if (!navigator.mediaSession?.metadata?.artwork) {
    console.warn("No artwork metadata");
    return;
  }

  const artwork = navigator.mediaSession.metadata.artwork;
  const imgSrc = [...artwork].pop()?.src;
  if (!imgSrc) {
    console.warn("No valid artwork URL");
    return;
  }

  try {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = imgSrc;
    await image.decode();

    const ctx = pictureInPictureCanvas.getContext("2d");
    if (!ctx) {
      console.error("Canvas context is null");
      return;
    }

    ctx.clearRect(
      0,
      0,
      pictureInPictureCanvas.width,
      pictureInPictureCanvas.height
    );
    ctx.drawImage(image, 0, 0, 512, 512);

    video.pause();
    video.play();

    await video.requestPictureInPicture();
  } catch (err) {
    console.error("Error processing PiP:", err);
  }
}
