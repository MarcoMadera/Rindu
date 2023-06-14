import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getMyAlbums(
  offset: number,
  accessToken: string
): Promise<SpotifyApi.UsersSavedAlbumsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/me/albums?limit=50&offset=${offset}`,
    method: "GET",
    accessToken,
  });

  return handleJsonResponse<SpotifyApi.UsersSavedAlbumsResponse>(res);
}
