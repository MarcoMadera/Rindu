import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function addToQueue(
  uri: string,
  device_id: string,
  context?: ServerApiContext
): Promise<SpotifyApi.AddToQueueResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/me/player/queue?uri=${uri}&device_id=${device_id}`,
    method: "POST",
    context,
  });
  return res.ok;
}
