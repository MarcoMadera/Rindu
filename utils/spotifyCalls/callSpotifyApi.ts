import { refreshAccessToken } from "./refreshAccessToken";
import type { ServerApiContext } from "types/serverContext";
import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

interface ICallSpotifyApi {
  endpoint: string;
  method: string;
  context: ServerApiContext | undefined;
  body?: BodyInit | null;
  retry?: boolean;
}

export async function callSpotifyApi({
  endpoint,
  method,
  context,
  body,
  retry,
}: ICallSpotifyApi): Promise<Response> {
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${takeCookie(ACCESS_TOKEN_COOKIE, context)}`,
    },
    body,
  });

  if (res.ok && res.status === 401 && !retry) {
    await refreshAccessToken(context);
    return callSpotifyApi({
      endpoint,
      method,
      context,
      body,
      retry: true,
    });
  }

  return res;
}
