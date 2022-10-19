export const ACCESS_TOKEN_COOKIE = "qs";
export const REFRESH_TOKEN_COOKIE = "rs";
export const EXPIRE_TOKEN_COOKIE = "ex";
export const MONTHS = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
] as const;
export const SPOTIFY_CLIENT_ID = process.env
  .NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;
export const SPOTIFY_REDIRECT_URL = process.env
  .NEXT_PUBLIC_SPOTIFY_REDIRECT_URL as string;
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
] as const;
export const SPOTIFY_AUTH_LOGIN_RESPONSE_TYPE = "code";
