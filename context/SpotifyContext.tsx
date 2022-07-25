import useAuth from "hooks/useAuth";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import useToggle from "hooks/useToggle";
import Head from "next/head";
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ISpotifyContext, ITrack, PlaylistItems } from "types/spotify";
import { callPictureInPicture } from "utils/callPictureInPicture";
import { removeTracksFromPlaylist } from "utils/spotifyCalls/removeTracksFromPlaylist";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SpotifyContext = createContext<ISpotifyContext>(null!);
export default SpotifyContext;

export function SpotifyContextProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [playlists, setPlaylists] = useState<PlaylistItems>([]);
  const [totalPlaylists, setTotalPlaylists] = useState<number>(0);
  const [allTracks, setAllTracks] = useState<ITrack[]>([]);
  const [deviceId, setDeviceId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSideBarImg, setIsShowingSideBarImg] = useState(false);
  const [currrentlyPlaying, setCurrentlyPlaying] = useState<ITrack>();
  const [currentlyPlayingPosition, setCurrentlyPlayingPosition] =
    useState<number>();
  const [currentlyPlayingDuration, setCurrentlyPlayingDuration] =
    useState<number>();
  const [player, setPlayer] = useState<Spotify.Player | AudioPlayer>();
  const [playlistPlayingId, setPlaylistPlayingId] = useState<string>();
  const [playedSource, setPlayedSource] = useState<string>();
  const [pageDetails, setPageDetails] =
    useState<ISpotifyContext["pageDetails"]>(null);
  const [volume, setVolume] = useState<number>(1);
  const [lastVolume, setLastVolume] = useState<number>(1);
  const [isPip, setIsPip] = useState(false);
  const [showHamburguerMenu, setShowHamburguerMenu] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState<ITrack[]>([]);
  const pictureInPictureCanvas = useRef<HTMLCanvasElement>();
  const videoRef = useRef<HTMLVideoElement>();
  const [reconnectionError, setReconnectionError] = useState(false);
  const [showLyrics, setShowLyrics] = useToggle();

  const { user } = useAuth();
  const isPremium = user?.product === "premium";

  useEffect(() => {
    if (!reconnectionError || !isPremium) return;
    const timer = setTimeout(() => {
      (player as Spotify.Player).connect();
      setReconnectionError(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [isPremium, player, reconnectionError]);

  useEffect(() => {
    if (playedSource) {
      const type = playedSource.split(":")[1];
      if (type === "track" && currrentlyPlaying) {
        setRecentlyPlayed((prev) => {
          if (prev.some((el) => el.uri === currrentlyPlaying.uri)) {
            localStorage.setItem(
              `${user?.id}:recentlyPlayed`,
              JSON.stringify(prev)
            );
            return prev;
          }

          if (prev.length === 10) {
            const newRecentlyPlayedwithLimit = [
              currrentlyPlaying,
              ...prev.slice(0, -1),
            ];
            localStorage.setItem(
              `${user?.id}:recentlyPlayed`,
              JSON.stringify(newRecentlyPlayedwithLimit)
            );
            return newRecentlyPlayedwithLimit;
          }
          const newRecentlyPlayed = [currrentlyPlaying, ...prev];
          localStorage.setItem(
            `${user?.id}:recentlyPlayed`,
            JSON.stringify(newRecentlyPlayed)
          );

          return newRecentlyPlayed;
        });
      }
    }
  }, [playedSource, currrentlyPlaying, user?.id]);

  useEffect(() => {
    const playback = localStorage.getItem("playback");
    const recentlyPlayedFromLocal = localStorage.getItem(
      `${user?.id}:recentlyPlayed`
    );
    if (playback) {
      const playbackObj = JSON.parse(decodeURI(playback));
      setVolume(playbackObj.volume);
      player?.setVolume(playbackObj.volume);
    }
    if (recentlyPlayedFromLocal) {
      const recentlyPlayedObj = JSON.parse(recentlyPlayedFromLocal);
      setRecentlyPlayed(recentlyPlayedObj);
    }
  }, [player, user?.id]);

  useEffect(() => {
    if (currrentlyPlaying && "mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currrentlyPlaying.name,
        artist: currrentlyPlaying.artists?.[0]?.name,
        album: currrentlyPlaying.album?.name,
        artwork: currrentlyPlaying.album?.images?.map(
          ({ url, width, height }) => {
            return {
              src: url ?? "",
              sizes: `${width}x${height}`,
              type: "",
            };
          }
        ),
      });
    }

    if (
      pictureInPictureCanvas.current &&
      videoRef.current &&
      document.pictureInPictureElement
    ) {
      callPictureInPicture(pictureInPictureCanvas.current, videoRef.current);
    }
  }, [currrentlyPlaying]);

  useEffect(() => {
    if (
      (videoRef.current || pictureInPictureCanvas.current || !isPlaying,
      !currrentlyPlaying)
    ) {
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const video = document.createElement("video");
    video.addEventListener("leavepictureinpicture", () => {
      setIsPip(false);
    });
    video.addEventListener("enterpictureinpicture", () => {
      setIsPip(true);
    });

    video.muted = true;
    canvas.getContext("2d");
    video.srcObject = canvas.captureStream();
    pictureInPictureCanvas.current = canvas;
    videoRef.current = video;

    return () => {
      video.removeEventListener("leavepictureinpicture", () => {
        setIsPip(false);
      });
      video.removeEventListener("enterpictureinpicture", () => {
        setIsPip(true);
      });
    };
  }, [currrentlyPlaying, isPlaying]);

  useEffect(() => {
    const duration = currrentlyPlaying?.duration_ms;
    currentlyPlayingDuration;
    if ("setPositionState" in navigator.mediaSession) {
      navigator.mediaSession.setPositionState({
        duration: duration ?? 0,
        playbackRate: 1,
        position:
          currentlyPlayingPosition &&
          currentlyPlayingPosition <= (duration ?? 0)
            ? currentlyPlayingPosition
            : 0,
      });
    }
  }, [
    currentlyPlayingDuration,
    currentlyPlayingPosition,
    currrentlyPlaying,
    currrentlyPlaying?.duration_ms,
  ]);

  useEffect(() => {
    if (player && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", function () {
          if (!isPremium) {
            player?.togglePlay();
            return;
          }
          (player as Spotify.Player)?.resume();
          setIsPlaying(true);
        });
        navigator.mediaSession.setActionHandler("pause", function () {
          player?.pause();
          setIsPlaying(false);
        });
        navigator.mediaSession.setActionHandler("stop", function () {
          player.pause();
          setIsPlaying(false);
        });
        navigator.mediaSession.setActionHandler("seekbackward", function () {
          player.seek(
            !currentlyPlayingPosition || currentlyPlayingPosition <= 10
              ? 0
              : currentlyPlayingPosition - 10
          );
        });
        navigator.mediaSession.setActionHandler("seekforward", function () {
          player.seek(
            !currentlyPlayingPosition ? 10 : currentlyPlayingPosition + 10
          );
        });
        navigator.mediaSession.setActionHandler("seekto", function (e) {
          e.seekTime && player.seek(e.seekTime);
        });
        navigator.mediaSession.setActionHandler("previoustrack", function () {
          player.previousTrack();
        });
        navigator.mediaSession.setActionHandler("nexttrack", function () {
          player.nextTrack();
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [currentlyPlayingPosition, isPremium, player, user]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      if (isPlaying) {
        navigator.mediaSession.playbackState = "playing";
      }
      if (!isPlaying) {
        navigator.mediaSession.playbackState = "paused";
      }
      if (!isPlaying && !currrentlyPlaying) {
        navigator.mediaSession.playbackState = "none";
      }
    }
  }, [currrentlyPlaying, isPlaying]);

  const removeTracks = useCallback(
    async (
      playlist: string | undefined,
      tracks: number[],
      snapshotID: string | undefined
    ) => {
      try {
        const res = await removeTracksFromPlaylist(
          playlist,
          tracks,
          snapshotID
        );
        if (!res) {
          throw Error("Failed to remove tracks");
        }
        return res.snapshot_id;
      } catch (err) {
        console.log(err);
        return;
      }
    },
    []
  );

  return (
    <SpotifyContext.Provider
      value={{
        playlists,
        totalPlaylists,
        allTracks,
        setPlaylists,
        setTotalPlaylists,
        setAllTracks,
        deviceId,
        setDeviceId,
        setIsPlaying,
        isPlaying,
        setCurrentlyPlaying,
        currrentlyPlaying,
        currentlyPlayingPosition,
        currentlyPlayingDuration,
        setCurrentlyPlayingPosition,
        setCurrentlyPlayingDuration,
        player,
        setPlayer,
        playlistPlayingId,
        setPlaylistPlayingId,
        pageDetails,
        setPageDetails,
        playedSource,
        setPlayedSource,
        isShowingSideBarImg,
        setIsShowingSideBarImg,
        volume,
        setVolume,
        lastVolume,
        setLastVolume,
        pictureInPictureCanvas,
        videoRef,
        isPip,
        setIsPip,
        showHamburguerMenu,
        setShowHamburguerMenu,
        recentlyPlayed,
        setReconnectionError,
        removeTracks,
        showLyrics,
        setShowLyrics,
      }}
    >
      {currrentlyPlaying?.name && (
        <Head>
          <title>{`${currrentlyPlaying?.name} - ${currrentlyPlaying?.artists?.[0].name}`}</title>
        </Head>
      )}
      {children}
    </SpotifyContext.Provider>
  );
}
