import { ReactElement } from "react";

import { LyricsPictureInPicture } from "components/icons";
import { useAuth, useSpotify, useToast, useTranslations } from "hooks";

interface ILyricsPIPButtonProps {
  background?: string;
}
export default function LyricsPIPButton({
  background,
}: Readonly<ILyricsPIPButtonProps>): ReactElement {
  const {
    setIsPictureInPictureLyircsCanvas,
    isPictureInPictureLyircsCanvas,
    videoRef,
    setIsPip,
    isPip,
  } = useSpotify();

  const { isPremium } = useAuth();
  const { translations } = useTranslations();
  const { addToast } = useToast();

  return (
    <button
      className="lyrics-pip-button"
      onClick={async (e) => {
        e.stopPropagation();
        if (!isPremium) {
          addToast({
            variant: "error",
            message: translations.toastMessages.premiumRequired,
          });
        }
        if (
          isPictureInPictureLyircsCanvas &&
          document.pictureInPictureElement
        ) {
          await document.exitPictureInPicture();
          setIsPictureInPictureLyircsCanvas.off();
          setIsPip(false);
          return;
        }
        setIsPictureInPictureLyircsCanvas.on();
        setIsPip(true);
        await videoRef.current?.play();
        await videoRef.current?.requestPictureInPicture();
      }}
    >
      <LyricsPictureInPicture />
      <style jsx>{`
        .lyrics-pip-button {
          width: 40px;
          height: 40px;
          margin: 0 0 0 32px;
          z-index: 999999999999900;
          padding: 10px;
          color: ${isPip && isPictureInPictureLyircsCanvas
            ? "#1db954"
            : "#ffffffb3"};
          --border-width: 3px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: Lato, sans-serif;
          font-size: 2.5rem;
          text-transform: uppercase;
          background: ${background ?? "transparent"};
          border: none;
        }
        .lyrics-pip-button:hover {
          color: #fff;
        }
      `}</style>
    </button>
  );
}
