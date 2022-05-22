export async function getMyAlbums(
  offset: number,
  accessToken: string
): Promise<SpotifyApi.UsersSavedAlbumsResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/albums?limit=50&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (res.ok) {
    const data: SpotifyApi.UsersSavedAlbumsResponse = await res.json();
    return data;
  }
  return null;
}
