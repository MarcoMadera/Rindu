export interface SetListArtistInfo {
  mbid: string;
  tmid: number;
  name: string;
  sortName: string;
  disambiguation: string;
  url: string;
}

interface SetListArtistResponse {
  artist: SetListArtistInfo[];
  total: number;
  page: number;
  itemsPerPage: number;
}

export async function getSetListArtist(
  artistName?: string,
  apiKey?: string
): Promise<SetListArtistInfo | null> {
  if (!artistName || !apiKey) return null;
  const res = await fetch(
    `https://api.setlist.fm/rest/1.0/search/artists?artistName=${artistName}&p=1&sort=relevance`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
    }
  );

  if (res.ok) {
    const data = (await res.json()) as SetListArtistResponse;
    if (data.artist.length > 0) {
      return data.artist[0];
    }
    return null;
  }
  return null;
}
