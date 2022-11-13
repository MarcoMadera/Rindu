export interface Artist {
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
    artist: Artist[];
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

interface FanArtData {
  name: string;
  mbid_id: string;
  artistbackground: {
    id: string;
    url: string;
    likes: string;
  }[];
  artistthumb: {
    id: string;
    url: string;
    likes: string;
  }[];
  albums: Record<string, unknown>[];
  musiclogo: {
    id: string;
    url: string;
    likes: string;
  }[];
  musicbanner: {
    id: string;
    url: string;
    likes: string;
  }[];
}

export async function getArtistInfo(
  artistName?: string,
  api?: string
): Promise<Artist | null> {
  if (!artistName) return null;
  try {
    const res = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${api}&format=json`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (res.ok) {
      const data: { artist: Artist } = await res.json();
      if (data?.artist?.mbid) {
        const fanArtRes = await fetch(
          `http://webservice.fanart.tv/v3/music/${data.artist.mbid}?api_key=${process.env.FAN_ART_TV_API_KEY}`
        );
        if (fanArtRes.ok) {
          const fanArtData: FanArtData = await fanArtRes.json();
          const artist = {
            ...data.artist,
            banner: fanArtData?.artistbackground?.[0]?.url,
            thumb: fanArtData?.artistthumb?.[0]?.url,
          };
          return artist;
        }
      }
      return data.artist;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
