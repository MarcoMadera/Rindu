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
    const data: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
      await res.json();
    return data;
  }
  return null;
}
