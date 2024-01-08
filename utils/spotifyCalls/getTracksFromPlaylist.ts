import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getTracksFromPlaylist(
  playlistId: string,
  offset = 0,
  context?: ServerApiContext | undefined
): Promise<SpotifyApi.PlaylistTrackResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/playlists/${playlistId}/tracks?offset=${offset}&limit=50&fields=items(added_at,is_local,track(id,album(name,images,id),artists(name,id,type,uri),name,duration_ms,uri,explicit,is_playable,preview_url,type)),total`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.PlaylistTrackResponse>(res);
}
