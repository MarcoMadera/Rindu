import React, {
  HTMLAttributes,
  MouseEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import { Pause, Play } from "components/icons";
import { play } from "lib/spotify";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import useToast from "hooks/useToast";
import useOnScreen from "hooks/useOnScreen";

export function PlayButton({
  size,
  centerSize,
  track,
  isSingle,
  uri,
  position,
  ...props
}: {
  size: number;
  centerSize: number;
  track?: SpotifyApi.TrackObjectFull;
  isSingle?: boolean;
  uri?: string;
  position?: number;
} & HTMLAttributes<HTMLButtonElement>): ReactElement | null {
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
  const { accessToken, user, setAccessToken } = useAuth();
  const [isThisTrackPlaying, setIsThisTrackPlaying] = useState(false);
  const [isThisPlaylistPlaying, setIsThisPlaylistPlaying] = useState(false);
  const [isThisArtistPlaying, setIsThisArtistPlaying] = useState(false);
  const { addToast } = useToast();
  const isPremium = user?.product === "premium";
  const uriId = uri?.split(":")?.[2];
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isVisible = useOnScreen(buttonRef);

  useEffect(() => {
    if (track?.id) {
      const isTheSameTrackAsPlaying = track?.id === currrentlyPlaying?.id;
      if (isTheSameTrackAsPlaying && isPlaying) {
        setIsThisTrackPlaying(true);
      } else {
        setIsThisTrackPlaying(false);
      }
    }

    const isTheSameArtistPlaying = uri === currrentlyPlaying?.artists?.[0]?.uri;

    if (isTheSameArtistPlaying && isPlaying) {
      setIsThisArtistPlaying(true);
    } else {
      setIsThisArtistPlaying(false);
    }
    const isTheSamePlaylistPlaying =
      playlistPlayingId && playlistPlayingId === uriId && !isSingle;
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
    allTracks,
    isSingle,
    uri,
    uriId,
  ]);

  const getCurrentState = useCallback(async () => {
    if (!player) return;
    if (!(player as Spotify.Player)?.getCurrentState) {
      addToast({
        variant: "error",
        message: "Not ready to play, if the issue persist refresh the page",
      });
      return;
    }
    const data = await (player as Spotify.Player)?.getCurrentState();
    return data;
  }, [addToast, player]);

  const handleClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (!accessToken || (!playlistDetails && !track && !uri) || !user) {
        return;
      }

      const playbackState = isPremium ? await getCurrentState() : undefined;
      const playbackRefersToThisPlaylist =
        (playbackState?.track_window?.current_track?.uri &&
          playbackState?.track_window?.current_track?.uri === track?.uri) ||
        (playlistPlayingId && playlistPlayingId === uriId && !isSingle) ||
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
          if (!isSingle) {
            allTracks.forEach((track) => {
              if (track.uri) {
                uris.push(track.uri);
              }
            });
          }
          const singleUri = track?.uri || uri;
          if (uris.length === 0 && singleUri) {
            uris.push(singleUri);
          }
          play(
            accessToken,
            deviceId,
            {
              uris: uris,
              offset: position ?? 0,
            },
            setAccessToken
          );

          const source = track?.uri || playlistDetails?.uri;

          const isCollection = source?.split(":")?.[3];
          setPlayedSource(
            isCollection && playlistDetails
              ? `spotify:${playlistDetails?.type}:${playlistDetails?.id}`
              : source
          );

          setPlaylistPlayingId(uriId);

          return setCurrentlyPlaying(track);
        }

        play(
          accessToken,
          deviceId,
          {
            context_uri: uri ?? playlistDetails?.uri,
          },
          setAccessToken
        ).then(() => {
          if (playlistDetails || uri) {
            setPlaylistPlayingId(uriId ?? playlistDetails?.id);
            const source = uri ?? playlistDetails?.uri;
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
      playlistPlayingId,
      position,
      setAccessToken,
      setCurrentlyPlaying,
      setIsPlaying,
      setPlayedSource,
      setPlaylistPlayingId,
      track,
      uri,
      uriId,
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
        ref={buttonRef}
        aria-hidden={isVisible ? "false" : "true"}
        tabIndex={isVisible ? 0 : -1}
        {...props}
      >
        {(isThisTrackPlaying && !isThisPlaylistPlaying) ||
        isThisArtistPlaying ||
        (isThisPlaylistPlaying &&
          !isThisArtistPlaying &&
          !isThisTrackPlaying &&
          !track) ? (
          <Pause fill="#fff" width={centerSize} height={centerSize} />
        ) : (
          <Play fill="#fff" width={centerSize} height={centerSize} />
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
        }
      `}</style>
    </>
  );
}
