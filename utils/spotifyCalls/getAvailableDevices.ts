import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getAvailableDevices(
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.UserDevicesResponse | null> {
  const res = await callSpotifyApi({
    endpoint: "/me/player/devices",
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.UserDevicesResponse>(res);
}
