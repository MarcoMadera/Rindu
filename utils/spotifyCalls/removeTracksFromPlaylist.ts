import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function removeTracksFromPlaylist(
  playlistId: string | undefined | null,
  positions: number[],
  snapshotId: string | undefined | null,
  context?: ServerApiContext
): Promise<SpotifyApi.RemoveTracksFromPlaylistResponse | null> {
  if (!playlistId || !snapshotId) return null;

  const res = await callSpotifyApi({
    endpoint: `/playlists/${playlistId}/tracks`,
    method: "DELETE",
    body: JSON.stringify({
      positions: positions,
      snapshot_id: snapshotId,
    }),
    context,
  });

  return handleJsonResponse<SpotifyApi.RemoveTracksFromPlaylistResponse>(res);
}
