import { MouseEvent, ReactElement } from "react";

import { LyricsPictureInPicture } from "components/icons";
import { useAuth, useSpotify, useToast, useTranslations } from "hooks";
import { configuration } from "utils";

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
    pipWindow,
  } = useSpotify();

  const { isPremium } = useAuth();
  const { translations } = useTranslations();
  const { addToast } = useToast();

  const handlePIPClick = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    if (!isPremium) {
      addToast({
        variant: "error",
        message: translations.toastMessages.premiumRequired,
      });
    }
    if (isPictureInPictureLyircsCanvas && document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      setIsPictureInPictureLyircsCanvas.off();
      setIsPip(false);
      return;
    }
    setIsPictureInPictureLyircsCanvas.on();
    setIsPip(true);
    videoRef.current?.play();
    await videoRef.current?.requestPictureInPicture();
  };

  const handleDocumentPIPClick = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.stopPropagation();
    if (isPictureInPictureLyircsCanvas && pipWindow) {
      pipWindow.current?.close();
      setIsPictureInPictureLyircsCanvas.off();
      setIsPip(false);
      return;
    }
    try {
      const pipWin = await window.documentPictureInPicture?.requestWindow({
        width: 500,
        height: 700,
      });
      pipWindow.current = pipWin ?? null;
      setIsPictureInPictureLyircsCanvas.on();
      setIsPip(true);
      pipWin?.addEventListener("unload", () => {
        pipWindow.current = null;
        setIsPip(false);
        setIsPictureInPictureLyircsCanvas.off();
      });
    } catch (err) {
      console.error("Failed to open PiP window:", err);
    }
  };

  return (
    <>
      <button
        className="lyrics-pip-button"
        onClick={(e) => {
          if (
            configuration.get("isDocPipEnabled") &&
            "documentPictureInPicture" in window
          ) {
            handleDocumentPIPClick(e);
          } else {
            handlePIPClick(e);
          }
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
    </>
  );
}
