import {
  API_AUTH_URL,
  CODE_VERIFIER_COOKIE,
  ENABLE_PKCE_AUTH,
  makeCookie,
  SCOPES,
  SPOTIFY_AUTH_LOGIN_RESPONSE_TYPE,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URL,
} from "utils";

async function getPKCEParams() {
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

  return {
    code_challenge_method: "S256",
    code_challenge: code_challenge_base64,
  };
}

export async function getSpotifyLoginURL(): Promise<string> {
  const params = {
    response_type: SPOTIFY_AUTH_LOGIN_RESPONSE_TYPE,
    client_id: SPOTIFY_CLIENT_ID,
    scope: SCOPES.join(","),
    redirect_uri: SPOTIFY_REDIRECT_URL,
  };

  if (ENABLE_PKCE_AUTH) {
    const PKCEParams = await getPKCEParams();

    Object.assign(params, PKCEParams);
  }

  const authUrl = new URL(API_AUTH_URL);

  authUrl.search = new URLSearchParams(params).toString();
  return authUrl.toString();
}
