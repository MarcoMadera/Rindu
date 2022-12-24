import useMediaSession from "hooks/useMediaSession";
import usePictureInPicture from "hooks/usePictureInPicture";
import useRecentlyPlayed from "hooks/useRecentlyPlayed";
import useReconnectSpotifyPlayer from "hooks/useReconnectSpotifyPlayer";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import useToggle from "hooks/useToggle";
import Head from "next/head";
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useRef,
  useState,
} from "react";
import { ISpotifyContext, ITrack, PlaylistItems } from "types/spotify";
import { removeTracksFromPlaylist } from "utils/spotifyCalls/removeTracksFromPlaylist";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const SpotifyContext = createContext<ISpotifyContext>(null!);
export default SpotifyContext;

export function SpotifyContextProvider({
  children,
}: PropsWithChildren): ReactElement {
  const [playlists, setPlaylists] = useState<PlaylistItems>([]);
  const [totalPlaylists, setTotalPlaylists] = useState<number>(0);
  const [progressMs, setProgressMs] = useState<number | null>(null);
  const [allTracks, setAllTracks] = useState<ITrack[]>([]);
  const [deviceId, setDeviceId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSideBarImg, setIsShowingSideBarImg] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<ITrack>();
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
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState<ITrack[]>([]);
  const pictureInPictureCanvas = useRef<HTMLCanvasElement>();
  const videoRef = useRef<HTMLVideoElement>();
  const [reconnectionError, setReconnectionError] = useState(false);
  const [suffleState, setSuffleState] = useState(false);
  const [repeatState, setRepeatState] = useState<0 | 1 | 2>(0);
  const [showLyrics, setShowLyrics] = useToggle();
  const [isPictureInPictureLyircsCanvas, setIsPictureInPictureLyircsCanvas] =
    useToggle();

  useReconnectSpotifyPlayer({
    reconnect: reconnectionError,
    player,
    setReconnectionError,
  });
  useRecentlyPlayed({
    setRecentlyPlayed,
    currentlyPlaying,
    playedSource,
    player,
    setVolume,
  });
  usePictureInPicture({
    setIsPip,
    videoRef,
    pictureInPictureCanvas,
    isPictureInPictureLyircsCanvas,
    isPlaying,
    currentlyPlaying,
  });
  useMediaSession({
    currentlyPlaying,
    currentlyPlayingPosition,
    player,
    isPlaying,
    setIsPlaying,
    videoRef,
    pictureInPictureCanvas,
    isPictureInPictureLyircsCanvas,
  });

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
        currentlyPlaying,
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
        showHamburgerMenu,
        setShowHamburgerMenu,
        recentlyPlayed,
        setReconnectionError,
        removeTracks,
        showLyrics,
        setShowLyrics,
        progressMs,
        setProgressMs,
        isPictureInPictureLyircsCanvas,
        setIsPictureInPictureLyircsCanvas,
        suffleState,
        setSuffleState,
        repeatState,
        setRepeatState,
      }}
    >
      {currentlyPlaying?.name && (
        <Head>
          <title>{`${currentlyPlaying?.name} - ${
            currentlyPlaying?.artists?.[0].name || "Rindu"
          }`}</title>
        </Head>
      )}
      {children}
    </SpotifyContext.Provider>
  );
}
