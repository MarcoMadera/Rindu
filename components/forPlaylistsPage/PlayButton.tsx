import React, { ReactElement } from "react";
import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import { Pause, Play } from "components/icons";
import { play } from "lib/spotify";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
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
    playlistPlayingId,
    allTracks,
    setPlaylistPlayingId,
    setCurrentlyPlaying,
  } = useSpotify();
  const { accessToken, user } = useAuth();
  const isThisPlaylistPlaying =
    playlistPlayingId === playlistDetails?.id && isPlaying;

  async function getCurrentState() {
    const data = await (player as Spotify.Player)?.getCurrentState();
    return data;
  }

  async function handleClick() {
    if (!accessToken || !playlistDetails || !user) {
      return;
    }
    const isPremium = user.product === "premium";
    const playbackState = isPremium ? await getCurrentState() : undefined;
    const playbackRefersToThisPlaylist =
      playbackState?.context.uri === playlistDetails.uri;

    if (isPremium && deviceId) {
      if (playbackRefersToThisPlaylist) {
        isPlaying ? player?.pause() : (player as Spotify.Player)?.resume();
        return;
      }

      play(accessToken, deviceId, {
        context_uri: playlistDetails.uri,
        offset: 0,
      });
    }

    if (!isPremium) {
      if (playlistPlayingId === playlistDetails?.id) {
        player?.togglePlay();
        return;
      }
      (player as AudioPlayer).allTracks = allTracks;
      if (allTracks[0].audio) {
        (player as AudioPlayer).src = allTracks[0].audio;
        (player as AudioPlayer)?.play();
        setCurrentlyPlaying(allTracks[0]);
      } else {
        (player as AudioPlayer)?.nextTrack();
      }
      setPlaylistPlayingId(playlistDetails.id);
    }
  }

  return (
    <>
      <button className="playPlaylist" onClick={handleClick}>
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
