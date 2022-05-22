export async function getMyShows(
  offset: number,
  accessToken: string
): Promise<SpotifyApi.UsersSavedShowsResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/me/shows?limit=50&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  return null;
}
