import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function getAvailableDevices(
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.UserDevicesResponse | null> {
  const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE, cookies)
      }`,
    },
  });

  if (res.ok) {
    const data: SpotifyApi.UserDevicesResponse = await res.json();
    return data;
  }
  return null;
}
