import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { IUseToggleHandlers } from "hooks/useToggle";
import { Dispatch, MutableRefObject, SetStateAction } from "react";

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface AuthorizationResponse extends RefreshTokenResponse {
  refresh_token: string;
}

// Playlists
export type PlaylistItem = SpotifyApi.PlaylistObjectSimplified;

export type PlaylistItems = PlaylistItem[];

interface IPageDetails {
  id?: string;
  uri?: string;
  type?: "playlist" | "artist" | "collection" | "concert";
  name?: string;
  description?: string | null;
  tracks?: { total?: number };
  snapshot_id?: string;
  owner?: { id?: string; display_name?: string };
  followers?: { total?: number };
  images?: { url?: string }[];
}

export interface ITrack {
  uri?: string;
  preview_url?: string | null;
  id?: string | null;
  name?: string;
  album?: {
    id?: string;
    name?: string;
    images: { url?: string; width?: number | null; height?: number | null }[];
    type?: "track" | "album" | "episode" | "ad";
    uri?: string;
    release_date?: string;
  };
  artists?: {
    name?: string;
    id?: string;
    uri?: string;
    type?: "artist" | undefined;
  }[];
  type?: "track" | "episode" | "ad";
  is_local?: boolean;
  duration_ms?: number;
  position?: number;
  is_playable?: boolean;
  corruptedTrack?: boolean;
  explicit?: boolean;
  added_at?: string | number;
  popularity?: number;
}

export interface ISpotifyContext {
  playlists: PlaylistItems;
  setPlaylists: Dispatch<SetStateAction<PlaylistItems>>;
  totalPlaylists: number;
  setTotalPlaylists: Dispatch<SetStateAction<number>>;
  deviceId: string | undefined;
  setDeviceId: Dispatch<SetStateAction<string | undefined>>;
  allTracks: ITrack[];
  setAllTracks: Dispatch<SetStateAction<ITrack[]>>;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  isPlaying: boolean;
  isPip: boolean;
  setIsShowingSideBarImg: Dispatch<SetStateAction<boolean>>;
  setIsPip: Dispatch<SetStateAction<boolean>>;
  isShowingSideBarImg: boolean;
  setCurrentlyPlaying: Dispatch<SetStateAction<ITrack | undefined>>;
  currentlyPlaying: ITrack | undefined;
  currentlyPlayingPosition: number | undefined;
  currentlyPlayingDuration: number | undefined;
  setCurrentlyPlayingPosition: Dispatch<SetStateAction<number | undefined>>;
  setCurrentlyPlayingDuration: Dispatch<SetStateAction<number | undefined>>;
  player: Spotify.Player | AudioPlayer | undefined;
  setPlayer: Dispatch<SetStateAction<Spotify.Player | AudioPlayer | undefined>>;
  pageDetails: IPageDetails | null;
  setPlaylistPlayingId: Dispatch<SetStateAction<string | undefined>>;
  playlistPlayingId: string | undefined;
  setPageDetails: Dispatch<SetStateAction<IPageDetails | null>>;
  playedSource: string | undefined;
  setPlayedSource: Dispatch<SetStateAction<string | undefined>>;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;
  lastVolume: number;
  setLastVolume: Dispatch<SetStateAction<number>>;
  pictureInPictureCanvas: MutableRefObject<HTMLCanvasElement | undefined>;
  videoRef: MutableRefObject<HTMLVideoElement | undefined>;
  showHamburgerMenu: boolean;
  setShowHamburgerMenu: Dispatch<SetStateAction<boolean>>;
  setReconnectionError: Dispatch<SetStateAction<boolean>>;
  recentlyPlayed: ITrack[];
  removeTracks: (
    playlist: string | undefined,
    tracks: number[],
    snapshotID: string | undefined
  ) => Promise<string | undefined>;
  showLyrics: boolean;
  setShowLyrics: IUseToggleHandlers;
  isPictureInPictureLyircsCanvas: boolean;
  setIsPictureInPictureLyircsCanvas: IUseToggleHandlers;
  progressMs: number | null;
  setProgressMs: Dispatch<SetStateAction<number | null>>;
}
