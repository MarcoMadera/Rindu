import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function transferPlayback(
  device_ids: string[],
  options?: { play?: boolean; context?: ServerApiContext } | undefined
): Promise<boolean> {
  const { context, play = true } = options ?? {};
  const res = await callSpotifyApi({
    endpoint: "/me/player",
    method: "PUT",
    context,
    body: JSON.stringify({
      device_ids,
      play,
    }),
  });

  return res.ok;
}
