import { getSiteUrl } from "./enviroment";

export async function getLyrics(
  artistName: string,
  title: string
): Promise<string | null> {
  const res = await fetch(`${getSiteUrl()}/api/lyrics`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ artistName, title }),
  });
  if (res.ok) {
    const lyrics: string | null = await res.json();
    return lyrics;
  }
  return null;
}
