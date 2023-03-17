import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function getPlaylistsFromUser(
  userId: string,
  accessToken?: string
): Promise<SpotifyApi.ListOfUsersPlaylistsResponse | null> {
  if (!userId) {
    return null;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
    }
  );
  if (res.ok) {
    const data = (await res.json()) as SpotifyApi.ListOfUsersPlaylistsResponse;
    return data;
  }
  return null;
}
