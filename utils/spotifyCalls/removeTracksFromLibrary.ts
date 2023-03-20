import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function removeTracksFromLibrary(
  ids: string[],
  accessToken?: string
): Promise<boolean> {
  const res = await fetch("https://api.spotify.com/v1/me/tracks", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
      }`,
    },
    body: JSON.stringify({ ids }),
  });
  return res.ok;
}
