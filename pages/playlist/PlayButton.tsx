import React, { ReactElement } from "react";
import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import { Pause, Play } from "components/icons";
import { play } from "lib/spotify";

export function PlayButton({
  size,
  centerSize,
}: {
  size: number;
  centerSize: number;
}): ReactElement {
  const {
    isPlaying,
    player,
    deviceId,
    playlistDetails,
    isThisPlaylistPlaying,
  } = useSpotify();
  const { accessToken } = useAuth();
  return (
    <>
      <button
        className="playPlaylist"
        onClick={() => {
          if (!accessToken && !playlistDetails?.uri && !deviceId) {
            return;
          }
          if (isPlaying && accessToken && deviceId) {
            player?.getCurrentState().then((e) => {
              if (e?.context.uri === playlistDetails?.uri) {
                player.pause();
              }
              if (e?.context.uri !== playlistDetails?.uri) {
                play(accessToken, deviceId, {
                  context_uri: playlistDetails?.uri,
                  offset: 0,
                });
              }
            });
          }
          if (!isPlaying && accessToken && deviceId) {
            player?.getCurrentState().then((e) => {
              if (e?.context.uri === playlistDetails?.uri) {
                player.resume();
                return;
              }
              play(accessToken, deviceId, {
                context_uri: playlistDetails?.uri,
                offset: 0,
              });
            });
          }
        }}
      >
        {isThisPlaylistPlaying ? (
          <Pause fill="#fff" width={centerSize} height={centerSize} />
        ) : (
          <Play fill="#fff" width={centerSize} height={centerSize} />
        )}
      </button>
      <style jsx>{`
        .playPlaylist {
          background-color: #1db954;
          display: flex;
          justify-content: center;
          align-items: center;
          width: ${size}px;
          height: ${size}px;
          border: none;
          border-radius: 50%;
        }
        .playPlaylist:focus,
        .playPlaylist:hover {
          transform: scale(1.06);
        }
        .playPlaylist:active {
          transform: scale(1);
        }
      `}</style>
    </>
  );
}
