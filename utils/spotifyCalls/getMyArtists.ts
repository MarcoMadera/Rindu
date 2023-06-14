import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMyArtists(
  accessToken: string
): Promise<SpotifyApi.UsersFollowedArtistsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: "/me/following?type=artist&limit=50",
    method: "GET",
    accessToken,
  });

  return handleJsonResponse<SpotifyApi.UsersFollowedArtistsResponse>(res);
}
