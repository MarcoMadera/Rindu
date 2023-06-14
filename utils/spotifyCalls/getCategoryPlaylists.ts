import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getCategoryPlaylists(
  category: string,
  country?: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.CategoryPlaylistsResponse | null> {
  const res = await callSpotifyApi({
    endpoint: `/browse/categories/${category}/playlists?country=${
      country ?? "US"
    }`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.CategoryPlaylistsResponse>(res);
}
