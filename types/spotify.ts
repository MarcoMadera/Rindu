import { Dispatch, MutableRefObject, SetStateAction } from "react";

import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { IUseToggleHandlers } from "hooks/useToggle";

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

export interface IPageDetails {
  id?: string;
  uri?: string;
  type?:
    | "playlist"
    | "artist"
    | "collection"
    | "concert"
    | "radio"
    | "episode"
    | "podcast"
    | "top";
  name?: string;
  description?: string | null;
  tracks?: { total?: number };
  snapshot_id?: string;
  owner?: { id?: string; display_name?: string };
  followers?: { total?: number };
  images?: SpotifyApi.ImageObject[];
}

export interface ITrackArtist {
  name?: string;
  id?: string;
  uri?: string;
  type?: "artist" | "show";
}

export interface ITrack {
  uri?: string;
  preview_url?: string | null;
  id?: string | null;
  name?: string;
  album?: {
    id?: string;
    name?: string;
    images: Spotify.Image[];
    type?: "track" | "album" | "episode" | "ad" | "show";
    uri?: string;
    release_date?: string;
  };
  artists?: ITrackArtist[];
  type?: "track" | "episode" | "ad";
  is_local?: boolean;
  duration_ms?: number;
  position?: number;
  is_playable?: boolean;
  corruptedTrack?: boolean;
  explicit?: boolean;
  added_at?: string | number;
  popularity?: number;
  description?: string;
}

export enum DisplayInFullScreen {
  Lyrics = "lyrics",
  Queue = "queue",
  App = "app",
  Player = "player",
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
  setPreviousTracks: Dispatch<SetStateAction<ITrack[]>>;
  previousTracks: ITrack[];
  setCurrentlyPlaying: Dispatch<SetStateAction<ITrack | undefined>>;
  currentlyPlaying: ITrack | undefined;
  setNextTracks: Dispatch<SetStateAction<ITrack[]>>;
  nextTracks: ITrack[];
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
  hideSideBar: boolean;
  setHideSideBar: Dispatch<SetStateAction<boolean>>;
  setReconnectionError: Dispatch<SetStateAction<boolean>>;
  recentlyPlayed: ITrack[];
  removeTracks: (
    playlist: string | undefined,
    tracks: number[],
    snapshotID: string | undefined
  ) => Promise<string>;
  displayInFullScreen: DisplayInFullScreen;
  setDisplayInFullScreen: Dispatch<SetStateAction<DisplayInFullScreen>>;
  isPictureInPictureLyircsCanvas: boolean;
  setIsPictureInPictureLyircsCanvas: IUseToggleHandlers;
  suffleState: boolean;
  setSuffleState: Dispatch<SetStateAction<boolean>>;
  repeatState: 0 | 1 | 2;
  setRepeatState: Dispatch<SetStateAction<0 | 1 | 2>>;
  setIgnoreShortcuts: IUseToggleHandlers;
}
