import { ACCESS_TOKEN_COOKIE, takeCookie } from "utils";

export default async function removeEpisodesFromLibrary(
  episodeIds: string[],
  accessToken?: string
): Promise<boolean> {
  const ids = episodeIds.join();
  const res = await fetch(`https://api.spotify.com/v1/me/episodes?ids=${ids}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE) || ""
      }`,
    },
  });
  return res.ok;
}
