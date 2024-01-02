import { NextApiRequest, NextApiResponse } from "next";

import { getSiteUrl } from "utils";
import { ISyncedLyricsResponse } from "utils/getLyrics";

async function getToken(): Promise<string | null> {
  try {
    const res = await fetch(
      "https://open.spotify.com/get_access_token?reason=transport&productType=web_player",
      {
        headers: {
          method: "GET",
          referer: "https://open.spotify.com/",
          origin: "https://open.spotify.com",
          accept: "application/json",
          "accept-language": "en",
          "app-platform": "WebPlayer",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "spotify-app-version": "1.1.54.35.ge9dace1d",
          cookie: process.env.SPOTIFY_ACCESS_COOKIE ?? "",
        },
      }
    );
    if (res.ok) {
      const data = (await res.json()) as { accessToken: string };
      return data.accessToken;
    }
    console.warn(
      `Warning: https://open.spotify.com/get_access_token null token with status: ${
        res.status
      } and cookie: ${process.env.SPOTIFY_ACCESS_COOKIE ?? "no cookie"}`
    );
    return null;
  } catch (err) {
    console.error("Error: https://open.spotify.com/get_access_token ", err);
    return null;
  }
}

async function getLyrics(trackId: string) {
  const token = await getToken();
  if (!token) {
    return null;
  }
  try {
    const res = await fetch(
      `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&vocalRemoval=false&market=from_token`,
      {
        headers: {
          method: "GET",
          "App-platform": "WebPlayer",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.ok) {
      const data = (await res.json()) as ISyncedLyricsResponse;
      return data;
    }
    return null;
  } catch (err) {
    console.error(
      "Error: https://spclient.wg.spotify.com/color-lyrics/v2 ",
      err
    );
    return null;
  }
}

interface ISyncedLyricsBody {
  trackId?: string;
}

export default async function syncedLyrics(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const thisUrl = getSiteUrl();
  const body = req.body as ISyncedLyricsBody;

  if (
    thisUrl &&
    req.headers.referer &&
    !req.headers.referer.startsWith(thisUrl)
  ) {
    res.status(401).end();
    return;
  }
  if (!body.trackId) {
    return res.status(400).json({ error: "Missing trackId" });
  }
  try {
    const lyrics = await getLyrics(body.trackId);
    if (!lyrics) {
      return res.status(404).json({ error: "No lyrics found" });
    }
    return res.json(lyrics);
  } catch (err) {
    console.error(err);
    return res.status(404).json({ error: "No lyrics found" });
  }
}
