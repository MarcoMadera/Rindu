import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getFeaturedPlaylists(
  country: string,
  limit: number,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.ListOfFeaturedPlaylistsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/browse/featured-playlists?country=${country}&limit=${limit}&market=from_token`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.ListOfFeaturedPlaylistsResponse>(res);
}
