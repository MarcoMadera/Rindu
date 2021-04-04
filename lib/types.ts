export type AuthorizationResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};
export type RefreshResponse = {
  accessToken: string;
  refreshToken: string | undefined;
  expiresIn: number;
};
export type SpotifyUserResponse = {
  name: string | undefined;
  image: string | undefined;
  href: string;
  id: string;
};
// Playlists
export type PlaylistItem = {
  images: SpotifyApi.ImageObject[];
  name: string;
  isPublic: boolean | null;
  tracks: number;
  description: string | null;
  id: string;
  snapshot_id: string;
  href: string;
  owner: string;
};
export type PlaylistItems = PlaylistItem[];
export type UserPlaylistsResponse = {
  items: PlaylistItems;
  total: number;
};

//Tracks
export type normalTrackTypes = {
  name?: string;
  corruptedTrack: boolean;
  position: number;
  images?: SpotifyApi.ImageObject[];
  uri?: string;
  href?: string;
  artists?: string;
  id?: string;
  audio: string | null;
  explicit?: boolean;
  duration?: number;
};
export type trackItem = normalTrackTypes;
export type AllTracksFromAPlayList = trackItem[];
export type AllTracksFromAPlaylistResponse = {
  tracks: AllTracksFromAPlayList;
};

export type RemoveTracksResponse = string | undefined;
