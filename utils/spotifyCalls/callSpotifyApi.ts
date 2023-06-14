import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

interface ICallSpotifyApi {
  endpoint: string;
  method: string;
  accessToken?: string | null;
  cookies?: string;
  body?: BodyInit | null;
}

export async function callSpotifyApi({
  endpoint,
  method,
  accessToken,
  cookies,
  body,
}: ICallSpotifyApi): Promise<Response> {
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken ?? takeCookie(ACCESS_TOKEN_COOKIE, cookies) ?? ""
      }`,
    },
    body,
  });

  return res;
}
