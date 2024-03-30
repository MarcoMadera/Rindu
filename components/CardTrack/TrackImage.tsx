import { ReactElement, useRef } from "react";

import { CardType } from "./CardTrack";
import { PlayButtonIcon } from "./PlayButtonIcon";
import {
  useAuth,
  useOnScreen,
  useSpotify,
  useToast,
  useTranslations,
} from "hooks";
import { ITrack } from "types/spotify";
import { chooseImage, templateReplace } from "utils";

interface ITrackImage {
  mouseEnter: boolean;
  isFocusing: boolean;
  track: ITrack;
  isSmallScreen: boolean;
  playThisTrack: () => void;
  visualPosition?: number;
  position?: number;
  type: CardType;
}
export function TrackImage({
  mouseEnter,
  isFocusing,
  track,
  isSmallScreen,
  playThisTrack,
  visualPosition,
  position,
  type,
}: Readonly<ITrackImage>): ReactElement {
  const { currentlyPlaying, player, isPlaying, setIsPlaying } = useSpotify();
  const trackRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const { translations } = useTranslations();
  const isVisible = useOnScreen(trackRef);
  const { isPremium } = useAuth();

  const isPlayable =
    track?.type === "episode" ||
    (!isPremium && track?.preview_url) ||
    (isPremium && track?.is_playable !== false && !track?.is_local);

  const isTheSameAsCurrentlyPlaying =
    currentlyPlaying?.name === track?.name &&
    currentlyPlaying?.album?.name === track?.album?.name;

  return (
    <button
      type="button"
      className="playButton"
      aria-label={isPlaying && isTheSameAsCurrentlyPlaying ? "Pause" : "Play"}
      onClick={() => {
        if (isSmallScreen) return;
        if (isTheSameAsCurrentlyPlaying && isPlayable) {
          player?.togglePlay();
          setIsPlaying(!isPlaying);
          return;
        }
        if (isPlayable) {
          if (track.corruptedTrack) {
            addToast({
              variant: "error",
              message: templateReplace(
                translations.toastMessages.isCorruptedAndCannotBePlayed,
                [translations.contentType.track]
              ),
            });
            return;
          }
          if (isPremium) {
            (player as Spotify.Player)?.activateElement();
          }
          playThisTrack();
        } else {
          addToast({
            variant: "info",
            message: translations.toastMessages.contentIsUnavailable,
          });
        }
      }}
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={isVisible ? "false" : "true"}
    >
      <PlayButtonIcon
        mouseEnter={mouseEnter}
        isTheSameAsCurrentlyPlaying={isTheSameAsCurrentlyPlaying}
        isPlaying={isPlaying}
        isFocusing={isFocusing}
        isPlayable={isPlayable}
        visualPosition={visualPosition}
        position={position}
      />
      <style jsx>{`
        button.playButton {
          background-image: ${type === "presentation"
            ? `url(${chooseImage(track.album?.images, 50).url})`
            : "unset"};
        }
        button.playButton {
          width: ${type !== "presentation" ? "32" : "40"}px;
          height: ${type !== "presentation" ? "32" : "40"}px;
        }
      `}</style>
      <style jsx>{`
        button.playButton {
          object-position: center center;
          object-fit: cover;
          background-color: transparent;
          background-size: 40px 40px;
          background-repeat: no-repeat;
          background-position: center;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          margin: 0 15px 0 15px;
        }
      `}</style>
    </button>
  );
}
