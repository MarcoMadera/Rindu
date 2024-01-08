import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function saveTracksToLibrary(
  tracksIds: string[],
  context?: ServerApiContext
): Promise<boolean> {
  const ids = tracksIds.join();
  const res = await callSpotifyApi({
    endpoint: `/me/tracks?ids=${ids}`,
    method: "PUT",
    context,
  });

  return res.ok;
}
