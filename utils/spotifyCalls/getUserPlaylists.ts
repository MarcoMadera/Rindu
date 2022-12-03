export async function getUserPlaylists(
  accessToken: string,
  offset = 0,
  limit = 50
): Promise<SpotifyApi.ListOfCurrentUsersPlaylistsResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (res.ok) {
    const data =
      (await res.json()) as SpotifyApi.ListOfCurrentUsersPlaylistsResponse;
    return data;
  }
  return null;
}
