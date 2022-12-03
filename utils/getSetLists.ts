interface SetListArtistInfo {
  mbid: string;
  tmid: number;
  name: string;
  sortName: string;
  disambiguation: string;
  url: string;
}

export interface SetLists {
  setlist: {
    artist: SetListArtistInfo[];
    venue?: {
      city: {
        coords: {
          lat: number;
          lng: number;
        };
        country: {
          code: string;
          name: string;
        };
        id: string;
        name: string;
        state: string;
        stateCode: string;
      };
      url: string;
      id: string;
      name: string;
    };
    tour?: {
      name: string;
    };
    sets?: {
      set: {
        name: string;
        encore: number;
        song: { name: string; info?: string }[];
      }[];
      url: string;
    };
    info: string;
    url: string;
    id: string;
    versionId: string;
    eventDate: string;
    lastUpdated: string;
  }[];
  total: number;
  page: number;
  itemsPerPage: number;
}

export async function getSetLists(
  artistName?: string,
  apiKey?: string
): Promise<SetLists | null> {
  if (!artistName || !apiKey) return null;
  const res = await fetch(
    `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${artistName}&p=1&sort=relevance`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
    }
  );

  if (res.ok) {
    const data = (await res.json()) as SetLists;
    return data;
  }
  return null;
}
