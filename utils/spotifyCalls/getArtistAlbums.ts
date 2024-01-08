import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export enum Include_groups {
  Album = "album",
  Single = "single",
  AppearsOn = "appears_on",
  Compilation = "compilation",
}

export async function getArtistAlbums(
  id: string,
  market: string,
  include_groups: Include_groups,
  context?: ServerApiContext
): Promise<SpotifyApi.ArtistsAlbumsResponse | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/artists/${id}/albums?include_groups=${include_groups}&market=${market}`,
    method: "GET",
    context,
  });

  return handleJsonResponse<SpotifyApi.ArtistsAlbumsResponse>(res);
}
