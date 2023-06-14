import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getAlbumById(
  id: string,
  market: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.SingleAlbumResponse | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/albums/${id}?market=${market}`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.SingleAlbumResponse>(res);
}
