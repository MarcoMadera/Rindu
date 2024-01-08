import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMyLikedSongs(
  limit: number = 50,
  offset: number = 0,
  context?: ServerApiContext | undefined
): Promise<SpotifyApi.PlaylistTrackResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/me/tracks?limit=${limit}&offset=${offset}&market=from_token`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.PlaylistTrackResponse>(res);
}
