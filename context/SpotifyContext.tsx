import {
  createContext,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import Head from "next/head";

import {
  useMediaSession,
  usePictureInPicture,
  useRecentlyPlayed,
  useReconnectSpotifyPlayer,
  useShortCuts,
  useToggle,
} from "hooks";
import { AudioPlayer } from "hooks/useSpotifyPlayer";
import {
  DisplayInFullScreen,
  ISpotifyContext,
  ITrack,
  PlaylistItems,
} from "types/spotify";
import { RemoveTrackError } from "utils";
import { removeTracksFromPlaylist } from "utils/spotifyCalls";

const SpotifyContext = createContext<ISpotifyContext | undefined>(undefined);
export default SpotifyContext;

interface ISpotifyContextProviderProps {
  value?: ISpotifyContext;
}

export function SpotifyContextProvider({
  children,
  value: propsValue,
}: PropsWithChildren<ISpotifyContextProviderProps>): ReactElement {
  const [playlists, setPlaylists] = useState<PlaylistItems>([]);
  const [totalPlaylists, setTotalPlaylists] = useState<number>(0);
  const [allTracks, setAllTracks] = useState<ITrack[]>([]);
  const [deviceId, setDeviceId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSideBarImg, setIsShowingSideBarImg] = useState(false);
  const [previousTracks, setPreviousTracks] = useState<ITrack[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<ITrack>();
  const [nextTracks, setNextTracks] = useState<ITrack[]>([]);
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
  const [hideSideBar, setHideSideBar] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState<ITrack[]>([]);
  const pictureInPictureCanvas = useRef<HTMLCanvasElement>();
  const videoRef = useRef<HTMLVideoElement>();
  const [reconnectionError, setReconnectionError] = useState(false);
  const [suffleState, setSuffleState] = useState(false);
  const [repeatState, setRepeatState] = useState<0 | 1 | 2>(0);
  const [displayInFullScreen, setDisplayInFullScreen] =
    useState<DisplayInFullScreen>(DisplayInFullScreen.App);
  const [isPictureInPictureLyircsCanvas, setIsPictureInPictureLyircsCanvas] =
    useToggle();
  const [ignoreShortcuts, setIgnoreShortcuts] = useToggle();

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
  useShortCuts({
    ignoreShortcuts,
    setDisplayInFullScreen,
    player,
    currentlyPlaying,
  });

  const removeTracks = useCallback(
    async (
      playlist: string | undefined,
      tracks: number[],
      snapshotID: string | undefined
    ) => {
      const res = await removeTracksFromPlaylist(playlist, tracks, snapshotID);
      if (!res?.snapshot_id) {
        throw new RemoveTrackError();
      }
      return res.snapshot_id;
    },
    []
  );

  const value = useMemo(
    () => ({
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
      hideSideBar,
      setHideSideBar,
      recentlyPlayed,
      setReconnectionError,
      removeTracks,
      isPictureInPictureLyircsCanvas,
      setIsPictureInPictureLyircsCanvas,
      suffleState,
      setSuffleState,
      repeatState,
      setRepeatState,
      displayInFullScreen,
      setDisplayInFullScreen,
      previousTracks,
      setPreviousTracks,
      nextTracks,
      setNextTracks,
      setIgnoreShortcuts,
      ...propsValue,
    }),
    [
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
      hideSideBar,
      setHideSideBar,
      recentlyPlayed,
      setReconnectionError,
      removeTracks,
      isPictureInPictureLyircsCanvas,
      setIsPictureInPictureLyircsCanvas,
      suffleState,
      setSuffleState,
      repeatState,
      setRepeatState,
      displayInFullScreen,
      setDisplayInFullScreen,
      previousTracks,
      setPreviousTracks,
      nextTracks,
      setNextTracks,
      setIgnoreShortcuts,
      propsValue,
    ]
  );

  return (
    <SpotifyContext.Provider value={value}>
      {currentlyPlaying?.name && (
        <Head>
          <title>{`${currentlyPlaying?.name} - ${
            currentlyPlaying?.artists?.[0].name ?? "Rindu"
          }`}</title>
        </Head>
      )}
      {children}
    </SpotifyContext.Provider>
  );
}
