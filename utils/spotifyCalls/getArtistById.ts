import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getArtistById(
  id: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.SingleArtistResponse | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/artists/${id}`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.SingleArtistResponse>(res);
}
