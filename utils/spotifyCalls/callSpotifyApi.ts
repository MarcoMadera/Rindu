import { refreshAccessToken } from "./refreshAccessToken";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "utils/constants";
import { makeCookie, takeCookie } from "utils/cookies";

interface ICallSpotifyApi {
  endpoint: string;
  method: string;
  accessToken?: string | null;
  cookies?: string;
  body?: BodyInit | null;
  retry?: boolean;
}

export async function callSpotifyApi({
  endpoint,
  method,
  accessToken,
  cookies,
  body,
  retry,
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

  if (res.ok && res.status === 401 && !retry) {
    const { access_token, refresh_token } = (await refreshAccessToken()) ?? {};
    if (access_token && refresh_token) {
      makeCookie({
        name: REFRESH_TOKEN_COOKIE,
        value: refresh_token,
        age: 60 * 60 * 24 * 30 * 2,
      });
      makeCookie({
        name: ACCESS_TOKEN_COOKIE,
        value: access_token,
        age: 60 * 60 * 24 * 30 * 2,
      });
      return callSpotifyApi({
        endpoint,
        method,
        accessToken: access_token,
        cookies,
        body,
        retry: true,
      });
    }
  }

  return res;
}
