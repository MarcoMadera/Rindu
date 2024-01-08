import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMyArtists(
  context?: ServerApiContext
): Promise<SpotifyApi.UsersFollowedArtistsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: "/me/following?type=artist&limit=50",
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.UsersFollowedArtistsResponse>(res);
}
