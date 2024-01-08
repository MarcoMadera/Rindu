import type { ServerApiContext } from "types/serverContext";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function editPlaylistDetails(
  playlistId: string | undefined | null,
  name: string,
  description?: string,
  context?: ServerApiContext
): Promise<boolean | null> {
  if (!playlistId) return null;

  const body: { name: string; description?: string } = { name };
  if (description) body.description = description;

  const res = await callSpotifyApi({
    endpoint: `/playlists/${playlistId}`,
    method: "PUT",
    body: JSON.stringify(body),
    context,
  });

  return res.ok;
}
