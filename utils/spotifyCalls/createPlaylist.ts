import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function createPlaylist(
  user_id: string | undefined,
  options: {
    accessToken?: string;
    cookies?: string;
    name?: string;
    description?: string;
  }
): Promise<SpotifyApi.CreatePlaylistResponse | null> {
  if (!user_id) return null;
  const { name, description, accessToken, cookies } = options || {};
  const res = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists`,
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
      body: JSON.stringify({
        name: name ?? "New Playlist",
        description: description ?? "Your playlist created in Rindu",
        public: false,
      }),
    }
  );

  if (res.ok) {
    const data = (await res.json()) as SpotifyApi.CreatePlaylistResponse;
    return data;
  }
  return null;
}
