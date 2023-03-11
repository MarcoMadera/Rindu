import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export default async function repeat(
  state: "track" | "context" | "off",
  deviceId: string,
  accessToken?: string
): Promise<boolean> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/player/repeat?state=${state}&deviceId=${deviceId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
    }
  );
  return res.ok;
}
