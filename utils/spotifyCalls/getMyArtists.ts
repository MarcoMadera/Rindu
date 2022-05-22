export async function getMyArtists(
  accessToken: string
): Promise<SpotifyApi.UsersFollowedArtistsResponse | null> {
  const res = await fetch(
    "https://api.spotify.com/v1/me/following?type=artist&limit=50",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (res.ok) {
    const data: SpotifyApi.UsersFollowedArtistsResponse = await res.json();
    return data;
  }
  return null;
}
