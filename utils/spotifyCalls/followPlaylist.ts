import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function followPlaylist(
  id?: string,
  context?: ServerApiContext
): Promise<boolean | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/playlists/${id}/followers`,
    method: "PUT",
    context,
  });

  return res.ok;
}
