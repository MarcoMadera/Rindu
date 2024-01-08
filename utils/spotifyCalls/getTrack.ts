import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export async function getTrack(
  id: string,
  market: string,
  context?: ServerApiContext
): Promise<SpotifyApi.TrackObjectFull | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/tracks/${id}?market=${market}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.TrackObjectFull>(res);
}
