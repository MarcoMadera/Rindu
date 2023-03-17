import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export async function saveTracksToLibrary(
  tracksIds: string[],
  accessToken?: string
): Promise<boolean> {
  const ids = tracksIds.join();
  const res = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${ids}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
      }`,
    },
  });
  return res.ok;
}
