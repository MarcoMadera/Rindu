import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function addItemsToPlaylist(
  playlist_id: string,
  uris: string[],
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.AddTracksToPlaylistResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/playlists/${playlist_id}/tracks`,
    method: "POST",
    accessToken,
    cookies,
    body: JSON.stringify(uris),
  });

  return handleJsonResponse<SpotifyApi.AddTracksToPlaylistResponse>(res);
}
