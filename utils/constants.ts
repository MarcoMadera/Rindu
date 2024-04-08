import { Locale } from "./locale";

export const ACCESS_TOKEN_COOKIE = "qs";
export const REFRESH_TOKEN_COOKIE = "rs";
export const EXPIRE_TOKEN_COOKIE = "ex";
export const CODE_VERIFIER_COOKIE = "cv";
export const LOCALE_COOKIE = "NEXT_LOCALE";
export const SPOTIFY_CLIENT_ID = process.env
  .NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;
export const SPOTIFY_REDIRECT_URL = process.env
  .NEXT_PUBLIC_SPOTIFY_REDIRECT_URL as string;
export const ENABLE_PKCE_AUTH =
  process.env.NEXT_PUBLIC_ENABLE_PKCE_AUTH === "true";
export const API_AUTH_URL = "https://accounts.spotify.com/authorize?";
export const SCOPES = [
  "ugc-image-upload",
  "user-top-read",
  "streaming",
  "user-read-email",
  "user-follow-read",
  "user-follow-modify",
  "playlist-read-private",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-modify-private",
  "playlist-modify-public",
  "app-remote-control",
  "playlist-read-collaborative",
  "user-read-playback-position",
  "user-read-recently-played",
] as const;
export const SPOTIFY_AUTH_LOGIN_RESPONSE_TYPE = "code";
export const TOP_TRACKS_LONG_TERM_COLOR = "rgb(211, 62, 79)";
export const TOP_TRACKS_MEDIUM_TERM_COLOR = "rgb(250, 230, 45)";
export const TOP_TRACKS_SHORT_TERM_COLOR = "rgb(176, 153, 199)";
export const CONTEXT_MENU_ITEM_HEIGHT = 42.5;
export const CONTEXT_MENU_SIDE_OFFSET = 50;
export const CONTEXT_MENU_TOP_BOTTOM_OFFSET = CONTEXT_MENU_SIDE_OFFSET * 2;

export const LINE_HEIGHT = 40;
export const LYRICS_PIP_HEADER_HEIGH = 100;
export const LYRICS_PADDING_LEFT = 10;
export const DEFAULT_LOCALE = Locale.EN;
