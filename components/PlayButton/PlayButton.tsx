import { HTMLAttributes, ReactElement, useRef } from "react";

import { Pause, Play } from "components/icons";
import {
  useAuth,
  useIsThisPlaybackPlaying,
  useOnScreen,
  useSpotify,
  useToast,
} from "hooks";
import type { AudioPlayer } from "hooks/useSpotifyPlayer";
import { ITrack } from "types/spotify";
import { handleNonPremiumPlay, handlePremiumPlay } from "utils";

interface PlayButtonProps {
  size: number;
  centerSize: number;
  track?: ITrack;
  isSingle?: boolean;
  uri?: string;
  position?: number;
  allTracks: ITrack[];
}

export default function PlayButton({
  size,
  centerSize,
  track,
  isSingle,
  uri,
  position,
  allTracks,
  ...props
}: PlayButtonProps & HTMLAttributes<HTMLButtonElement>): ReactElement | null {
  const {
    isPlaying,
    player,
    deviceId,
    pageDetails,
    playlistPlayingId,
    setPlaylistPlayingId,
    setCurrentlyPlaying,
    setIsPlaying,
    setPlayedSource,
    setReconnectionError,
  } = useSpotify();
  const { user, isPremium } = useAuth();
  const { addToast } = useToast();
  const uriId = uri?.split(":")?.[2];
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isVisible = useOnScreen(buttonRef);

  const isThisPlaying = useIsThisPlaybackPlaying({
    track,
    trackId: track?.id,
    uri,
    isSingle,
    uriId,
    allTracksToPlay: allTracks,
  });

  return (
    <>
      <button
        type="button"
        aria-label="Play/Pause"
        className="play-Button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if ((!pageDetails && !track && !uri) || !user) {
            return;
          }
          if (isPremium && deviceId) {
            if (isThisPlaying) {
              player?.pause();
              return;
            }
            handlePremiumPlay(
              player as Spotify.Player,
              deviceId,
              addToast,
              setReconnectionError,
              setPlaylistPlayingId,
              setPlayedSource,
              track,
              isSingle,
              playlistPlayingId,
              uriId,
              pageDetails,
              uri,
              isPlaying,
              position,
              allTracks
            );
            return;
          }
          handleNonPremiumPlay(
            player as AudioPlayer,
            isThisPlaying,
            setIsPlaying,
            setCurrentlyPlaying,
            setPlaylistPlayingId,
            allTracks,
            pageDetails,
            track
          );
        }}
        ref={buttonRef}
        aria-hidden={isVisible ? "false" : "true"}
        tabIndex={isVisible ? 0 : -1}
        {...props}
      >
        {isThisPlaying ? (
          <Pause fill="#000" width={centerSize} height={centerSize} />
        ) : (
          <Play fill="#000" width={centerSize} height={centerSize} />
        )}
      </button>
      <style jsx>{`
        .play-Button {
          background-color: #1ed760;
          display: flex;
          justify-content: center;
          align-items: center;
          width: ${size}px;
          height: ${size}px;
          border: none;
          border-radius: 50%;
          min-width: ${size}px;
          z-index: 1;
          box-shadow: 0 8px 8px rgb(0 0 0 / 30%);
        }
        .play-Button:focus,
        .play-Button:hover {
          transform: scale(1.06);
          background-color: #1fdf64;
        }
        .play-Button:active {
          transform: scale(1);
          background-color: #169c46;
        }
      `}</style>
    </>
  );
}
