import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getPlaylistDetails(
  playlist_id: string,
  accessToken?: string | null,
  cookies?: string | undefined
): Promise<SpotifyApi.SinglePlaylistResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/playlists/${playlist_id}?fields=description,uri,images,name,owner,tracks.total,id,followers.total,snapshot_id`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.SinglePlaylistResponse>(res);
}
