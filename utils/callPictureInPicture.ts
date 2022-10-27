export async function callPictureInPicture(
  pictureInPictureCanvas: HTMLCanvasElement,
  video: HTMLVideoElement
): Promise<void> {
  if (!navigator.mediaSession?.metadata?.artwork) return;
  const artwork = navigator.mediaSession.metadata.artwork;

  try {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    const imgSrc = [...artwork].pop()?.src;
    if (!imgSrc) return;
    image.src = imgSrc;
    await image.decode();
    const ctx = pictureInPictureCanvas?.getContext("2d");
    ctx?.clearRect(
      0,
      0,
      pictureInPictureCanvas.width,
      pictureInPictureCanvas.height
    );
    ctx?.drawImage(image, 0, 0, 512, 512);

    await video?.play();
    await video?.requestPictureInPicture();
  } catch (err) {
    console.error(err);
  }
}
