import {
  API_AUTH_URL,
  CODE_VERIFIER_COOKIE,
  makeCookie,
  SCOPES,
  SPOTIFY_AUTH_LOGIN_RESPONSE_TYPE,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URL,
} from "utils";

export async function getSpotifyLoginURL(): Promise<string> {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest("SHA-256", data);

  const code_challenge_base64 = btoa(
    String.fromCharCode(...new Uint8Array(hashed))
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  makeCookie({
    name: CODE_VERIFIER_COOKIE,
    value: code_verifier,
    age: 60 * 20,
  });

  const authUrl = new URL(API_AUTH_URL);
  const params = {
    response_type: SPOTIFY_AUTH_LOGIN_RESPONSE_TYPE,
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES.join(","),
    code_challenge_method: "S256",
    code_challenge: code_challenge_base64,
    redirect_uri: SPOTIFY_REDIRECT_URL,
  };

  authUrl.search = new URLSearchParams(params).toString();
  return authUrl.toString();
}
