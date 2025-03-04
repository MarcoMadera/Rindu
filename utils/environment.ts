export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const env = process.env.NODE_ENV;
export const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
export const redirectUrl = `${baseUrl}/dashboard`;
export const enablePkceAuth =
  process.env.NEXT_PUBLIC_ENABLE_PKCE_AUTH ?? "true";
export const lyricsApiUrl = process.env.NEXT_PUBLIC_LYRICS_API_URL;
export const setlistFmApiKey = process.env.SETLIST_FM_API_KEY;
export const lastFmApiKey = process.env.LAST_FM_API_KEY;
export const spotifyAccessCookie = process.env.SPOTIFY_ACCESS_COOKIE;
export const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
export const fanArtTvApiKey = process.env.FAN_ART_TV_API_KEY;
export const hmacSecret = process.env.HMAC_SECRET ?? "change-this-secret";
export const isProduction = (): boolean => env === "production";
export const isServer = (): boolean =>
  !(typeof window != "undefined" && window.document);
