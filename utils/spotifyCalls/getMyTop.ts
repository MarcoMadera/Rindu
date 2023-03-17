import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export enum TopType {
  TRACKS = "tracks",
  ARTISTS = "artists",
}

export async function getMyTop<T extends TopType>(
  type: TopType | T,
  accessToken?: string | null,
  limit?: number,
  time_range?: "medium_term" | "short_term" | "long_term",
  cookies?: string | undefined
): Promise<
  T extends TopType.TRACKS
    ? SpotifyApi.UsersTopTracksResponse | null
    : SpotifyApi.UsersTopArtistsResponse | null
> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/${type}?time_range=${
      time_range ?? "short_term"
    }&limit=${limit ?? 10}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ?? (takeCookie(ACCESS_TOKEN_COOKIE, cookies) || "")
        }`,
      },
    }
  );

  if (res.ok) {
    const data = (await res.json()) as T extends TopType.TRACKS
      ? SpotifyApi.UsersTopTracksResponse
      : SpotifyApi.UsersTopArtistsResponse;
    return data;
  }
  return null;
}
