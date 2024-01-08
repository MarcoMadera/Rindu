import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function suffle(
  state: boolean,
  deviceId: string,
  context?: ServerApiContext
): Promise<boolean> {
  const res = await callSpotifyApi({
    endpoint: `/me/player/shuffle?state=${state.toString()}&deviceId=${deviceId}`,
    method: "PUT",
    context,
  });

  return res.ok;
}
