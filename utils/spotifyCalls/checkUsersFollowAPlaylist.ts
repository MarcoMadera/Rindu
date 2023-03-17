import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function checkUsersFollowAPlaylist(
  userIds?: string[],
  playlistId?: string,
  accessToken?: string
): Promise<boolean[] | null> {
  if (!playlistId || !userIds) {
    return null;
  }
  const ids = userIds.join();
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${ids}`,
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
  const data = (await res.json()) as boolean[];
  return data;
}
