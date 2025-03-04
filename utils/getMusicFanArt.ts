import { ApiError } from "next/dist/server/api-utils";

import { fanArtTvApiKey } from "./environment";

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

export async function getMusicFanArt(mbid: string): Promise<FanArtData | null> {
  if (!fanArtTvApiKey) {
    throw new ApiError(400, "env variable FANART_TV_API_KEY is not set");
  }
  const fanArtRes = await fetch(
    `http://webservice.fanart.tv/v3/music/${mbid}?api_key=${fanArtTvApiKey}`
  );

  if (!fanArtRes.ok) return null;

  const fanArtData = (await fanArtRes.json()) as FanArtData;
  return fanArtData;
}
