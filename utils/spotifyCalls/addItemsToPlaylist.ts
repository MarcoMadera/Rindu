import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function addItemsToPlaylist(
  playlist_id: string,
  uris: string[],
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.AddTracksToPlaylistResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken
            ? accessToken
            : takeCookie(ACCESS_TOKEN_COOKIE, cookies) || ""
        }`,
      },
      body: JSON.stringify(uris),
    }
  );

  if (res.ok) {
    const data = (await res.json()) as SpotifyApi.AddTracksToPlaylistResponse;
    return data;
  }
  return null;
}
