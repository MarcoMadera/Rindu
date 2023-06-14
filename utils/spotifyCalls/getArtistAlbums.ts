import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export enum Include_groups {
  album = "album",
  single = "single",
  appears_on = "appears_on",
  compilation = "compilation",
}

export async function getArtistAlbums(
  id: string,
  market: string,
  include_groups: Include_groups,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.ArtistsAlbumsResponse | null> {
  if (!id) return null;

  const res = await callSpotifyApi({
    endpoint: `/artists/${id}/albums?include_groups=${include_groups}&market=${market}`,
    method: "GET",
    accessToken,
    cookies,
  });

  return handleJsonResponse<SpotifyApi.ArtistsAlbumsResponse>(res);
}
