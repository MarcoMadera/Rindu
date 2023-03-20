import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function editPlaylistDetails(
  playlistId: string | undefined | null,
  name: string,
  description?: string,
  accessToken?: string
): Promise<boolean | null> {
  if (!playlistId) return null;

  const body: { name: string; description?: string } = { name };
  if (description) body.description = description;

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
        }`,
      },
      body: JSON.stringify(body),
    }
  );

  return res.ok;
}
