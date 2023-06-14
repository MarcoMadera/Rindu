import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMyLikedSongs(
  limit: number,
  accessToken?: string,
  cookies?: string | undefined
): Promise<SpotifyApi.PlaylistTrackResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/me/tracks?limit=${limit}&offset=0&market=from_token`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.PlaylistTrackResponse>(res);
}
