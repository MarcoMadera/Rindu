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
  product: string | undefined;
  followers: SpotifyApi.FollowersObject | undefined;
  country: string;
};
// Playlists
export type PlaylistItem = SpotifyApi.PlaylistObjectSimplified;

export type PlaylistItems = PlaylistItem[];

export type UserPlaylistsResponse = {
  items: PlaylistItems;
  total: number;
};

interface Artist extends Spotify.Artist {
  id?: string | null;
  type?: "artist" | undefined;
  href?: string | undefined;
  external_urls?: SpotifyApi.ExternalUrlObject | undefined;
}

interface Album extends Spotify.Album {
  album_type?: "album" | "single" | "compilation";
  artists?: Artist[];
  id?: string;
  release_date?: string;
}

//Tracks
export type normalTrackTypes = {
  name?: string;
  corruptedTrack?: boolean;
  position?: number;
  images?: Array<{ url: string }>;
  uri?: Spotify.Track["uri"];
  href?: string;
  artists?: Artist[];
  id?: string | null;
  audio?: string | null;
  explicit?: boolean;
  duration?: number;
  album: Album;
  added_at?: string;
  type: "track" | "episode" | "ad";
  media_type?: "audio" | "video";
  is_playable?: boolean | undefined;
  is_local?: boolean;
};
export type trackItem = normalTrackTypes;

export type AllTracksFromAPlayList = trackItem[];

export type AllTracksFromAPlaylistResponse = {
  tracks: AllTracksFromAPlayList;
};

export type RemoveTracksResponse = string | undefined;
