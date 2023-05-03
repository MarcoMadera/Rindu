export async function getMBID(artistName: string): Promise<string | null> {
  const mbApiUrl = "https://musicbrainz.org/ws/2/";
  const searchUrl = `${mbApiUrl}artist?query=${artistName}&limit=1&fmt=json`;

  const res = await fetch(searchUrl);

  if (!res.ok) return null;

  const data = (await res.json()) as { artists?: { id?: string }[] };
  const artistMbid = data?.artists?.[0]?.id || null;

  return artistMbid;
}
