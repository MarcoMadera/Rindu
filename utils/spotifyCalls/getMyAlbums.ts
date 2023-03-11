export default async function getMyAlbums(
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
    const data = (await res.json()) as SpotifyApi.UsersSavedAlbumsResponse;
    return data;
  }
  return null;
}
