import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function suffle(
  state: boolean,
  deviceId: string,
  accessToken?: string
): Promise<boolean> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/player/shuffle?state=${state}&deviceId=${deviceId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE)
        }`,
      },
    }
  );
  return res.ok;
}
