import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getShow(
  id: string,
  accessToken: string | undefined
): Promise<SpotifyApi.ShowObject | null> {
  const res = await callSpotifyApi({
    endpoint: `/shows/${id}`,
    method: "GET",
    accessToken,
  });

  return handleJsonResponse<SpotifyApi.ShowObject>(res);
}
