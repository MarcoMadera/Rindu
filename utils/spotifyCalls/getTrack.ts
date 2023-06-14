import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getTrack(
  id: string,
  market: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.TrackObjectFull | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/tracks/${id}?market=${market}`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.TrackObjectFull>(res);
}
