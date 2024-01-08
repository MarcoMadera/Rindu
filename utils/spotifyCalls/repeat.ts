import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function repeat(
  state: "track" | "context" | "off",
  deviceId: string,
  context?: ServerApiContext
): Promise<boolean> {
  const res = await callSpotifyApi({
    endpoint: `/player/repeat?state=${state}&deviceId=${deviceId}`,
    method: "PUT",
    context,
  });

  return res.ok;
}
