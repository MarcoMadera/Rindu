import { lastFmApiKey } from "./environment";

export interface ArtistScrobbleInfo {
  name: string;
  mbid?: string;
  url: string;
  image: {
    "#text": string;
    size: string;
  }[];
  streamable: string;
  ontour: string;
  stats: {
    listeners: string;
    playcount: string;
  };
  similar: {
    artist: ArtistScrobbleInfo[];
  };
  tags: {
    tag: {
      name: string;
      url: string;
    }[];
  };
  bio: {
    links: {
      link: {
        "#text": string;
        rel: string;
        href: string;
      };
    };
    published: string;
    summary: string;
    content: string;
  };
  banner?: string;
  thumb?: string;
}

export async function getArtistScrobbleInfo(
  artistName: string
): Promise<ArtistScrobbleInfo | null> {
  if (!lastFmApiKey) {
    throw new Error("No lastFmApiKey found");
  }
  const res = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${lastFmApiKey}&format=json`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    }
  );

  if (!res.ok) return null;

  const data = (await res.json()) as { artist: ArtistScrobbleInfo };
  return data.artist;
}
