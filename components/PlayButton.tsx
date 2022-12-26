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
import { play } from "utils/spotifyCalls/play";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import useToast from "hooks/useToast";
import useOnScreen from "hooks/useOnScreen";
import { ITrack } from "types/spotify";

interface PlayButtonProps {
  size: number;
  centerSize: number;
  track?: ITrack;
  isSingle?: boolean;
  uri?: string;
  position?: number;
  allTracks: ITrack[];
}

export function PlayButton({
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
    currentlyPlaying,
    setPlayedSource,
    setReconnectionError,
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
      const isTheSameTrackAsPlaying = track?.id === currentlyPlaying?.id;
      if (isTheSameTrackAsPlaying && isPlaying) {
        setIsThisTrackPlaying(true);
      } else {
        setIsThisTrackPlaying(false);
      }
    }

    const isTheSameArtistPlaying = uri === currentlyPlaying?.artists?.[0]?.uri;

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
    pageDetails?.id,
    track?.id,
    currentlyPlaying?.id,
    track?.artists,
    currentlyPlaying,
    allTracks,
    isSingle,
    uri,
    uriId,
  ]);

  const getCurrentState = useCallback(async () => {
    if (!player) return;
    if (!(player as Spotify.Player).getCurrentState) {
      addToast({
        variant: "error",
        message: "Not ready to play, if the issue persist refresh the page",
      });
      return;
    }
    const data = await (player as Spotify.Player).getCurrentState();
    return data;
  }, [addToast, player]);

  const handleClick = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      if (!accessToken || (!pageDetails && !track && !uri) || !user) {
        return;
      }

      const playbackState = isPremium ? await getCurrentState() : undefined;
      const playbackRefersToThisPlaylist =
        (playbackState?.track_window?.current_track?.uri &&
          playbackState?.track_window?.current_track?.uri === track?.uri) ||
        (playlistPlayingId && playlistPlayingId === uriId && !isSingle) ||
        (playbackState?.context.uri &&
          playbackState?.context.uri === pageDetails?.uri &&
          !track &&
          !uri);

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
          ).then((res) => {
            if (res.status === 404) {
              (player as Spotify.Player).disconnect();
              addToast({
                variant: "error",
                message: "Unable to play, trying to reconnect, please wait...",
              });
              setReconnectionError(true);
            }
            if (res.ok) {
              const source = track?.uri || pageDetails?.uri;

              const isCollection = source?.split(":")?.[3];
              setPlayedSource(
                isCollection && pageDetails?.type && pageDetails?.id
                  ? `spotify:${pageDetails?.type}:${pageDetails?.id}`
                  : source
              );

              setPlaylistPlayingId(uriId);
            }
          });

          return;
        }

        play(
          accessToken,
          deviceId,
          {
            context_uri: uri ?? pageDetails?.uri,
          },
          setAccessToken
        ).then((res) => {
          if (res.status === 404) {
            (player as Spotify.Player).disconnect();
            addToast({
              variant: "error",
              message: "Unable to play, trying to reconnect, please wait...",
            });
            setReconnectionError(true);
          }
          if (res.ok && (pageDetails || uri)) {
            setPlaylistPlayingId(uriId ?? pageDetails?.id);
            const source = uri ?? pageDetails?.uri;
            const isCollection = source?.split(":")?.[3];
            setPlayedSource(
              isCollection && pageDetails?.type && pageDetails?.id
                ? `spotify:${pageDetails?.type}:${pageDetails?.id}`
                : source
            );
          }
        });
      }

      if (!isPremium) {
        if (
          (track && isThisTrackPlaying) ||
          (pageDetails && isThisPlaylistPlaying && !track)
        ) {
          player?.togglePlay();
          return;
        }
        (player as AudioPlayer).allTracks = allTracks;
        if (track) {
          setIsPlaying(false);
          (player as AudioPlayer).allTracks = [track];
        }
        if (track?.preview_url || allTracks[0]?.preview_url) {
          const audio = track?.preview_url || allTracks[0].preview_url;
          (player as AudioPlayer).src = audio as string;
          (player as AudioPlayer).play();
          setCurrentlyPlaying(track || allTracks[0]);
        } else {
          (player as AudioPlayer).nextTrack();
        }
        if (pageDetails) {
          setPlaylistPlayingId(pageDetails.id);
        }
      }
    },
    [
      accessToken,
      addToast,
      allTracks,
      deviceId,
      getCurrentState,
      isPlaying,
      isPremium,
      isSingle,
      isThisPlaylistPlaying,
      isThisTrackPlaying,
      player,
      pageDetails,
      playlistPlayingId,
      position,
      setAccessToken,
      setCurrentlyPlaying,
      setIsPlaying,
      setPlayedSource,
      setPlaylistPlayingId,
      setReconnectionError,
      track,
      uri,
      uriId,
      user,
    ]
  );

  return (
    <>
      <button
        type="button"
        aria-label="Play/Pause"
        className="play-Button"
        onClick={(e) => {
          if (isPremium) {
            (player as Spotify.Player)?.activateElement();
          }
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
