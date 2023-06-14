import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function removeTracksFromPlaylist(
  playlistId: string | undefined | null,
  positions: number[],
  snapshotId: string | undefined | null,
  accessToken?: string
): Promise<SpotifyApi.RemoveTracksFromPlaylistResponse | null> {
  if (!playlistId || !snapshotId) return null;

  const res = await callSpotifyApi({
    endpoint: `/playlists/${playlistId}/tracks`,
    method: "DELETE",
    accessToken,
    body: JSON.stringify({
      positions: positions,
      snapshot_id: snapshotId,
    }),
  });

  return handleJsonResponse<SpotifyApi.RemoveTracksFromPlaylistResponse>(res);
}
