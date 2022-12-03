export interface SetList {
  artist: {
    mbid: string;
    tmid: number;
    name: string;
    sortName: string;
    disambiguation: string;
    url: string;
  };
  venue: {
    city: {
      id: string;
      name: string;
      stateCode: string;
      state: string;
      coords: {
        lat: number;
        lng: number;
      };
      country: {
        code: string;
        name: string;
      };
    };
    url: string;
    id: string;
    name: string;
  };
  tour: {
    name: string;
  };
  sets: {
    set: {
      name: string;
      encore: number;
      song: {
        name: string;
        with: unknown;
        cover: unknown;
        info: string;
        tape: boolean;
      }[];
    }[];
  };
  info: string;
  url: string;
  id: string;
  versionId: string;
  eventDate: string;
  lastUpdated: string;
}

export async function getSetList(
  id?: string,
  apiKey?: string
): Promise<SetList | null> {
  if (!id || !apiKey) return null;
  const res = await fetch(`https://api.setlist.fm/rest/1.0/setlist/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-api-key": apiKey,
    },
  });

  if (res.ok) {
    const data = (await res.json()) as SetList;
    return data;
  }
  return null;
}
