import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function followPlaylist(
  id?: string,
  accessToken?: string
): Promise<boolean | null> {
  if (!id) {
    return null;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/followers`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
    }
  );
  return res.ok;
}
