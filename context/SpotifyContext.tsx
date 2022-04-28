import useAuth from "hooks/useAuth";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import {
  createContext,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AllTracksFromAPlayList,
  ISpotifyContext,
  PlaylistItems,
  trackItem,
} from "types/spotify";
import { callPictureInPicture } from "utils/callPictureInPicture";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SpotifyContext = createContext<ISpotifyContext>(null!);
export default SpotifyContext;

export function SpotifyContextProvider({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [playlists, setPlaylists] = useState<PlaylistItems>([]);
  const [totalPlaylists, setTotalPlaylists] = useState<number>(0);
  const [allTracks, setAllTracks] = useState<AllTracksFromAPlayList>([]);
  const [deviceId, setDeviceId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSideBarImg, setIsShowingSideBarImg] = useState(false);
  const [currrentlyPlaying, setCurrentlyPlaying] = useState<trackItem>();
  const [currentlyPlayingPosition, setCurrentlyPlayingPosition] =
    useState<number>();
  const [currentlyPlayingDuration, setCurrentlyPlayingDuration] =
    useState<number>();
  const [player, setPlayer] = useState<Spotify.Player | AudioPlayer>();
  const [playlistPlayingId, setPlaylistPlayingId] = useState<string>();
  const [playedSource, setPlayedSource] = useState<string>();
  const [playlistDetails, setPlaylistDetails] =
    useState<ISpotifyContext["playlistDetails"]>(null);
  const [volume, setVolume] = useState<number>(1);
  const [lastVolume, setLastVolume] = useState<number>(1);
  const [isPip, setIsPip] = useState(false);
  const [showHamburguerMenu, setShowHamburguerMenu] = useState(false);
  const pictureInPictureCanvas = useRef<HTMLCanvasElement>();
  const videoRef = useRef<HTMLVideoElement>();

  const { user } = useAuth();

  useEffect(() => {
    if (currrentlyPlaying && "mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currrentlyPlaying.name,
        artist: currrentlyPlaying.artists?.[0]?.name,
        album: currrentlyPlaying.album.name,
        artwork: currrentlyPlaying.album.images?.map(
          ({ url, width, height }) => {
            return {
              src: url,
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

    video.muted = true;
    video.srcObject = canvas.captureStream();
    pictureInPictureCanvas.current = canvas;
    videoRef.current = video;
  }, [isPlaying, currrentlyPlaying]);

  useEffect(() => {
    if (
      "setPositionState" in navigator.mediaSession &&
      currrentlyPlaying?.duration
    ) {
      navigator.mediaSession.setPositionState({
        duration: currrentlyPlaying.duration,
        playbackRate: 1,
        position:
          currentlyPlayingPosition &&
          currentlyPlayingPosition <= currrentlyPlaying.duration
            ? currentlyPlayingPosition
            : 0,
      });
    }
  }, [currentlyPlayingPosition, currrentlyPlaying?.duration]);

  useEffect(() => {
    if (player && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("play", function () {
          player.togglePlay();
        });
        navigator.mediaSession.setActionHandler("pause", function () {
          player.togglePlay();
        });
        navigator.mediaSession.setActionHandler("stop", function () {
          player.pause();
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
  }, [currentlyPlayingPosition, player, user]);

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
        playlistDetails,
        setPlaylistDetails,
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
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}
