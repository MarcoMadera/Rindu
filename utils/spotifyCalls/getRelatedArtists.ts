import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getRelatedArtists(
  id: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.ArtistsRelatedArtistsResponse | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/artists/${id}/related-artists`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.ArtistsRelatedArtistsResponse>(res);
}
