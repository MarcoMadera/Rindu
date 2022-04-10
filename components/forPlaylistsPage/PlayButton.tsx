import React, {
  MouseEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import { Pause, Play } from "components/icons";
import { play } from "lib/spotify";
import { AudioPlayer } from "hooks/useSpotifyPlayer";

export function PlayButton({
  size,
  centerSize,
  track,
}: {
  size: number;
  centerSize: number;
  track?: SpotifyApi.TrackObjectFull;
}): ReactElement | null {
  const {
    isPlaying,
    player,
    deviceId,
    playlistDetails,
    playlistPlayingId,
    allTracks,
    setPlaylistPlayingId,
    setCurrentlyPlaying,
    setPlaylistDetails,
    setIsPlaying,
  } = useSpotify();
  const { accessToken, user } = useAuth();
  const { currrentlyPlaying } = useSpotify();
  const [isThisTrackPlaying, setIsThisTrackPlaying] = useState(false);
  const [isThisPlaylistPlaying, setIsThisPlaylistPlaying] = useState(false);
  const isPremium = user?.product === "premium";

  useEffect(() => {
    if (track?.id) {
      const isTheSameTrackAsPlaying = track?.id === currrentlyPlaying?.id;
      if (isTheSameTrackAsPlaying && isPlaying) {
        setIsThisTrackPlaying(true);
      } else {
        setIsThisTrackPlaying(false);
      }
    }

    if (!playlistPlayingId) return setIsThisPlaylistPlaying(false);
    const isTheSamePlaylistPlaying = playlistPlayingId === playlistDetails?.id;
    if (isTheSamePlaylistPlaying && isPlaying) {
      setIsThisPlaylistPlaying(true);
    } else {
      setIsThisPlaylistPlaying(false);
    }
  }, [
    isPlaying,
    playlistPlayingId,
    playlistDetails?.id,
    track?.id,
    currrentlyPlaying?.id,
  ]);

  const getCurrentState = useCallback(async () => {
    const data = await (player as Spotify.Player)?.getCurrentState();
    return data;
  }, [player]);

  useEffect(() => {
    if (track) {
      setPlaylistDetails(null);
      setPlaylistPlayingId(undefined);
    }
  }, [setPlaylistDetails, setPlaylistPlayingId, track]);

  const handleClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (!accessToken || (!playlistDetails && !track) || !user) {
        return;
      }

      const playbackState = isPremium ? await getCurrentState() : undefined;
      const playbackRefersToThisPlaylist =
        playbackState?.track_window.current_track.uri === track?.uri ||
        playbackState?.context.uri === playlistDetails?.uri;

      if (isPremium && deviceId) {
        if (playbackRefersToThisPlaylist) {
          isPlaying ? player?.pause() : (player as Spotify.Player)?.resume();
          return;
        }

        play(accessToken, deviceId, {
          context_uri: track?.uri || playlistDetails?.uri,
          offset: 0,
        });
      }

      if (!isPremium) {
        if (
          (track && isThisTrackPlaying) ||
          (playlistDetails && isThisPlaylistPlaying && !track)
        ) {
          player?.togglePlay();
          return;
        }
        (player as AudioPlayer).allTracks = allTracks;
        if (track) {
          setIsPlaying(false);
          (player as AudioPlayer).allTracks = [track];
        }
        if (track?.preview_url || allTracks[0]?.audio) {
          const audio = track?.preview_url || allTracks[0].audio;
          (player as AudioPlayer).src = audio as string;
          (player as AudioPlayer)?.play();
          setCurrentlyPlaying(track || allTracks[0]);
        } else {
          (player as AudioPlayer)?.nextTrack();
        }
        if (playlistDetails) {
          setPlaylistPlayingId(playlistDetails.id);
        }
      }
    },
    [
      accessToken,
      allTracks,
      deviceId,
      getCurrentState,
      isPlaying,
      isPremium,
      isThisPlaylistPlaying,
      isThisTrackPlaying,
      player,
      playlistDetails,
      setCurrentlyPlaying,
      setIsPlaying,
      setPlaylistPlayingId,
      track,
      user,
    ]
  );

  return (
    <>
      <button
        className="play-Button"
        onClick={(e) => {
          handleClick(e);
        }}
      >
        {(isThisTrackPlaying && !isThisPlaylistPlaying && !playlistDetails) ||
        (isThisPlaylistPlaying && !isThisTrackPlaying && !track) ? (
          <Pause fill="#fff" width={centerSize} height={centerSize} />
        ) : (
          <Play fill="#fff" width={centerSize} height={centerSize} />
        )}
      </button>
      <style jsx>{`
        .play-Button {
          background-color: #1db954;
          display: flex;
          justify-content: center;
          align-items: center;
          width: ${size}px;
          height: ${size}px;
          border: none;
          border-radius: 50%;
          min-width: ${size}px;
          z-index: 1;
        }
        .play-Button:focus,
        .play-Button:hover {
          transform: scale(1.06);
        }
        .play-Button:active {
          transform: scale(1);
        }
      `}</style>
    </>
  );
}
