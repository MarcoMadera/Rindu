import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

import { AudioPlayer } from "hooks";

export function usePictureInPicture({
  setIsPip,
  videoRef,
  pictureInPictureCanvas,
  isPictureInPictureLyircsCanvas,
  player,
}: {
  setIsPip: Dispatch<SetStateAction<boolean>>;
  videoRef: RefObject<HTMLVideoElement | null>;
  pictureInPictureCanvas: RefObject<HTMLCanvasElement | null>;
  isPictureInPictureLyircsCanvas: boolean;
  player?: AudioPlayer | Spotify.Player;
}): void {
  useEffect(() => {
    if (
      videoRef.current ||
      pictureInPictureCanvas.current ||
      !player ||
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
    document.body.appendChild(video);
    video.style.width = "1px";
    video.style.height = "1px";
    video.style.position = "absolute";
    video.style.top = "0px";
    video.play();
    videoRef.current = video;

    return () => {
      video.removeEventListener(
        "leavepictureinpicture",
        handleLeavePictureInPicture
      );
      video.removeEventListener(
        "enterpictureinpicture",
        handlEnterPictureInPicture
      );
    };
  }, [
    player,
    isPictureInPictureLyircsCanvas,
    pictureInPictureCanvas,
    setIsPip,
    videoRef,
  ]);
}
