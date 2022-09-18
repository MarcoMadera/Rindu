import useSpotify from "hooks/useSpotify";
import { ReactElement } from "react";
import { callPictureInPicture } from "utils/callPictureInPicture";
import { PictureInPicture } from "./icons/PictureInPicture";

export default function PictureInPictureButton(): ReactElement {
  const { pictureInPictureCanvas, videoRef, setIsPip, isPip } = useSpotify();
  return (
    <button
      type="button"
      aria-label="Picture in Picture"
      className="navBar-Button pictureInPicture"
      onClick={() => {
        if (pictureInPictureCanvas.current && videoRef.current) {
          if (isPip && document.pictureInPictureElement) {
            setIsPip(false);
            document.exitPictureInPicture();
          } else {
            callPictureInPicture(
              pictureInPictureCanvas.current,
              videoRef.current
            );
            setIsPip(true);
          }
        }
      }}
    >
      <PictureInPicture />
      <style jsx>{`
        .navBar-Button {
          background: transparent;
          border: none;
          outline: none;
          margin: 0 10px;
          color: #ffffffb3;
        }
        .navBar-Button.pictureInPicture {
          color: ${isPip ? "#1db954" : "#ffffffb3"};
        }
        .navBar-Button.pictureInPicture:hover {
          color: ${isPip ? "#1db954" : "#fff"};
        }
      `}</style>
    </button>
  );
}
