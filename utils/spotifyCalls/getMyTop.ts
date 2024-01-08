import type { ServerApiContext } from "types/serverContext";
import { handleJsonResponse } from "utils";
import { callSpotifyApi } from "utils/spotifyCalls";

export enum TopType {
  TRACKS = "tracks",
  ARTISTS = "artists",
}

export async function getMyTop<T extends TopType>(
  type: TopType | T,
  limit?: number,
  time_range?: "medium_term" | "short_term" | "long_term",
  context?: ServerApiContext
): Promise<
  T extends TopType.TRACKS
    ? SpotifyApi.UsersTopTracksResponse | null
    : SpotifyApi.UsersTopArtistsResponse | null
> {
  const res = await callSpotifyApi({
    endpoint: `/me/top/${type}?time_range=${time_range ?? "short_term"}&limit=${
      limit ?? 10
    }`,
    method: "GET",
    context,
  });

  return handleJsonResponse<
    T extends TopType.TRACKS
      ? SpotifyApi.UsersTopTracksResponse
      : SpotifyApi.UsersTopArtistsResponse
  >(res);
}
