interface LyricsResponse {
  lyrics: string;
}

export async function getLyrics(
  artist: string,
  title: string
): Promise<string | null> {
  const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const data: LyricsResponse = await res.json();
    return data.lyrics.replace(/(\r\n|\r|\n)/g, "\n");
  }
  return null;
}
