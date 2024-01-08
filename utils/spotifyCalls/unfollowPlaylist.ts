import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function unfollowPlaylist(
  id?: string,
  context?: ServerApiContext
): Promise<boolean | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/playlists/${id}/followers`,
    method: "DELETE",
    context,
  });

  return res.ok;
}
