import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function transferPlayback(
  device_ids: string[],
  accessToken?: string,
  cookies?: string
): Promise<boolean> {
  const res = await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE, cookies)
      }`,
    },
    body: JSON.stringify({
      device_ids,
      play: true,
    }),
  });

  return res.ok;
}
