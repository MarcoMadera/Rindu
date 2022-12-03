import { Dispatch, MutableRefObject, SetStateAction, useEffect } from "react";
import { callPictureInPicture } from "utils/callPictureInPicture";

export default function usePictureInPicture({
  setIsPip,
  videoRef,
  pictureInPictureCanvas,
  isPictureInPictureLyircsCanvas,
}: {
  setIsPip: Dispatch<SetStateAction<boolean>>;
  videoRef: MutableRefObject<HTMLVideoElement | undefined>;
  pictureInPictureCanvas: MutableRefObject<HTMLCanvasElement | undefined>;
  isPictureInPictureLyircsCanvas: boolean;
}): void {
  useEffect(() => {
    if (videoRef.current || pictureInPictureCanvas.current) {
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
  }, [pictureInPictureCanvas, setIsPip, videoRef]);

  useEffect(() => {
    if (
      pictureInPictureCanvas.current &&
      videoRef.current &&
      document.pictureInPictureElement &&
      !isPictureInPictureLyircsCanvas
    ) {
      callPictureInPicture(pictureInPictureCanvas.current, videoRef.current);
    }
  }, [isPictureInPictureLyircsCanvas, pictureInPictureCanvas, videoRef]);
}
