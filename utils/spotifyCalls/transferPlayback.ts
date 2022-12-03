import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function transferPlayback(
  device_ids: string[],
  options:
    | { play?: boolean; accessToken?: string; cookies?: string }
    | undefined
): Promise<boolean> {
  const { accessToken, cookies, play = true } = options || {};
  const res = await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken
          ? accessToken
          : takeCookie(ACCESS_TOKEN_COOKIE, cookies) || ""
      }`,
    },
    body: JSON.stringify({
      device_ids,
      play,
    }),
  });

  return res.ok;
}
