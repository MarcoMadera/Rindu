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
import { useRouter } from "next/router";

export function PlayButton({
  size,
  centerSize,
  track,
  isSingle,
}: {
  size: number;
  centerSize: number;
  track?: SpotifyApi.TrackObjectFull;
  isSingle?: boolean;
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
    setIsPlaying,
    currrentlyPlaying,
    setPlayedSource,
  } = useSpotify();
  const { accessToken, user } = useAuth();
  const [isThisTrackPlaying, setIsThisTrackPlaying] = useState(false);
  const [isThisPlaylistPlaying, setIsThisPlaylistPlaying] = useState(false);
  const [isThisArtistPlaying, setIsThisArtistPlaying] = useState(false);
  const isPremium = user?.product === "premium";
  const router = useRouter();

  useEffect(() => {
    if (track?.id) {
      const isTheSameTrackAsPlaying = track?.id === currrentlyPlaying?.id;
      if (isTheSameTrackAsPlaying && isPlaying) {
        setIsThisTrackPlaying(true);
      } else {
        setIsThisTrackPlaying(false);
      }
    }

    const isArtistPage = router.asPath.includes("/artist");

    const isTheSameArtistPlaying =
      isArtistPage &&
      isPlaying &&
      currrentlyPlaying?.artists?.[0]?.uri &&
      allTracks?.[0]?.artists?.[0]?.uri ===
        currrentlyPlaying?.artists?.[0]?.uri;

    if (isTheSameArtistPlaying && isPlaying) {
      setIsThisArtistPlaying(true);
    } else {
      setIsThisArtistPlaying(false);
    }

    const isTheSamePlaylistPlaying =
      playlistPlayingId &&
      playlistPlayingId === playlistDetails?.id &&
      !isSingle;
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
    track?.artists,
    currrentlyPlaying,
    router.asPath,
    allTracks,
    isSingle,
  ]);

  const getCurrentState = useCallback(async () => {
    if (!player) return;
    const data = await (player as Spotify.Player)?.getCurrentState();
    return data;
  }, [player]);

  const handleClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (!accessToken || (!playlistDetails && !track) || !user) {
        return;
      }

      const playbackState = isPremium ? await getCurrentState() : undefined;
      const playbackRefersToThisPlaylist =
        (playbackState?.track_window?.current_track.uri &&
          playbackState?.track_window?.current_track.uri === track?.uri) ||
        (playbackState?.context.uri &&
          playbackState?.context.uri === playlistDetails?.uri &&
          !track);

      if (isPremium && deviceId) {
        if (playbackRefersToThisPlaylist) {
          isPlaying ? player?.pause() : (player as Spotify.Player)?.resume();
          return;
        }

        if (track || isSingle) {
          const uris: string[] = [];
          allTracks.forEach((track) => {
            if (track.uri) {
              uris.push(track.uri);
            }
          });
          play(accessToken, deviceId, {
            uris: uris,
            offset: 0,
          });

          const source = track?.uri || playlistDetails?.uri;

          const isCollection = source?.split(":")?.[3];
          setPlayedSource(
            isCollection && playlistDetails
              ? `spotify:${playlistDetails?.type}:${playlistDetails?.id}`
              : source
          );

          return setCurrentlyPlaying(track);
        }

        play(accessToken, deviceId, {
          context_uri: playlistDetails?.uri,
          offset: 0,
        }).then(() => {
          if (playlistDetails) {
            setPlaylistPlayingId(playlistDetails.id);
            const source = playlistDetails?.uri;
            const isCollection = source?.split(":")?.[3];
            setPlayedSource(
              isCollection
                ? `spotify:${playlistDetails?.type}:${playlistDetails?.id}`
                : source
            );
          }
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
      isSingle,
      isThisPlaylistPlaying,
      isThisTrackPlaying,
      player,
      playlistDetails,
      setCurrentlyPlaying,
      setIsPlaying,
      setPlayedSource,
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
        {(isThisTrackPlaying && !isThisPlaylistPlaying) ||
        isThisArtistPlaying ||
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
