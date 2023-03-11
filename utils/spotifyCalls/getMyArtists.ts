export default async function getMyArtists(
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
    const data = (await res.json()) as SpotifyApi.UsersFollowedArtistsResponse;
    return data;
  }
  return null;
}
