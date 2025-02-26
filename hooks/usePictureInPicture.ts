import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

import { AudioPlayer, IUseToggleHandlers } from "hooks";

export function usePictureInPicture({
  setIsPip,
  videoRef,
  pictureInPictureCanvas,
  player,
}: {
  setIsPip: Dispatch<SetStateAction<boolean>>;
  videoRef: RefObject<HTMLVideoElement | null>;
  pictureInPictureCanvas: RefObject<HTMLCanvasElement | null>;
  player?: AudioPlayer | Spotify.Player;
  setIsPictureInPictureLyircsCanvas: IUseToggleHandlers;
}): void {
  useEffect(() => {
    if (videoRef.current || pictureInPictureCanvas.current || !player) {
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const video = document.createElement("video");

    function handleLeavePictureInPicture() {
      setIsPip(false);
    }
    function handleEnterPictureInPicture() {
      setIsPip(true);
    }

    video.muted = true;
    canvas.getContext("2d");
    video.srcObject = canvas.captureStream();
    pictureInPictureCanvas.current = canvas;
    document.body.appendChild(video);
    videoRef.current = video;

    video.style.width = "1px";
    video.style.height = "1px";
    video.style.position = "absolute";
    video.style.top = "0px";
    videoRef.current.play();
    videoRef.current?.addEventListener(
      "leavepictureinpicture",
      handleLeavePictureInPicture
    );
    videoRef?.current.addEventListener(
      "enterpictureinpicture",
      handleEnterPictureInPicture
    );

    return () => {
      videoRef.current?.removeEventListener(
        "leavepictureinpicture",
        handleLeavePictureInPicture
      );
      videoRef.current?.removeEventListener(
        "enterpictureinpicture",
        handleEnterPictureInPicture
      );
    };
  }, [player, pictureInPictureCanvas, setIsPip, videoRef]);
}
