import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function addToQueue(
  uri: string,
  device_id: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.AddToQueueResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/player/queue?uri=${uri}&device_id=${device_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken
            ? accessToken
            : takeCookie(ACCESS_TOKEN_COOKIE, cookies) || ""
        }`,
      },
    }
  );
  return res.ok;
}
