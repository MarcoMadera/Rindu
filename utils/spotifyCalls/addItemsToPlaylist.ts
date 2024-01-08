import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function addItemsToPlaylist(
  playlist_id: string,
  uris: string[],
  context?: ServerApiContext
): Promise<SpotifyApi.AddTracksToPlaylistResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/playlists/${playlist_id}/tracks`,
    method: "POST",
    context,
    body: JSON.stringify(uris),
  });

  return handleJsonResponse<SpotifyApi.AddTracksToPlaylistResponse>(res);
}
