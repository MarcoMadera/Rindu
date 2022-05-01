import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { takeCookie } from "utils/cookies";

export async function createPlaylist(
  user_id: string,
  accessToken?: string,
  cookies?: string
): Promise<SpotifyApi.CreatePlaylistResponse | null> {
  const res = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE, cookies)
        }`,
      },
      body: JSON.stringify({
        name: "New Playlist",
        description: "Your playlist created in Rindu",
        public: false,
      }),
    }
  );

  if (res.ok) {
    const data: SpotifyApi.CreatePlaylistResponse = await res.json();
    return data;
  }
  return null;
}
