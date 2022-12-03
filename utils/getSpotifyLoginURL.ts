import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_AUTH_LOGIN_RESPONSE_TYPE,
  SPOTIFY_REDIRECT_URL,
  SCOPES,
  API_AUTH_URL,
} from "./constants";

export function getSpotifyLoginURL(): string {
  const paramsData = {
    client_id: SPOTIFY_CLIENT_ID,
    response_type: SPOTIFY_AUTH_LOGIN_RESPONSE_TYPE,
    redirect_uri: SPOTIFY_REDIRECT_URL,
    scope: SCOPES.join(","),
  };
  const params = new URLSearchParams(paramsData);

  return `${API_AUTH_URL}${params.toString()}`;
}
