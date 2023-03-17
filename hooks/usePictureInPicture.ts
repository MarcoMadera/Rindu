import { Dispatch, MutableRefObject, SetStateAction, useEffect } from "react";

import { ITrack } from "types/spotify";

export function usePictureInPicture({
  setIsPip,
  videoRef,
  pictureInPictureCanvas,
  currentlyPlaying,
  isPictureInPictureLyircsCanvas,
}: {
  setIsPip: Dispatch<SetStateAction<boolean>>;
  videoRef: MutableRefObject<HTMLVideoElement | undefined>;
  pictureInPictureCanvas: MutableRefObject<HTMLCanvasElement | undefined>;
  isPictureInPictureLyircsCanvas: boolean;
  currentlyPlaying: ITrack | undefined;
}): void {
  useEffect(() => {
    if (
      videoRef.current ||
      pictureInPictureCanvas.current ||
      !currentlyPlaying ||
      isPictureInPictureLyircsCanvas
    ) {
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const video = document.createElement("video");

    function handleLeavePictureInPicture() {
      setIsPip(false);
    }
    function handlEnterPictureInPicture() {
      setIsPip(true);
    }

    video.addEventListener(
      "leavepictureinpicture",
      handleLeavePictureInPicture
    );
    video.addEventListener("enterpictureinpicture", handlEnterPictureInPicture);

    video.muted = true;
    canvas.getContext("2d");
    video.srcObject = canvas.captureStream();
    pictureInPictureCanvas.current = canvas;
    videoRef.current = video;
  }, [
    currentlyPlaying,
    isPictureInPictureLyircsCanvas,
    pictureInPictureCanvas,
    setIsPip,
    videoRef,
  ]);
}
