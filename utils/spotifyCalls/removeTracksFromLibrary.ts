import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function removeTracksFromLibrary(
  ids: string[],
  context?: ServerApiContext
): Promise<boolean> {
  const res = await callSpotifyApi({
    endpoint: "/me/tracks",
    method: "DELETE",
    body: JSON.stringify({ ids }),
    context,
  });

  return res.ok;
}
