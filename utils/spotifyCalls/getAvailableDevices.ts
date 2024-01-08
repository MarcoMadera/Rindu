import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getAvailableDevices(
  context?: ServerApiContext
): Promise<SpotifyApi.UserDevicesResponse | null> {
  const res = await callSpotifyApi({
    endpoint: "/me/player/devices",
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.UserDevicesResponse>(res);
}
