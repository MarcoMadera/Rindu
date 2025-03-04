import { lastFmApiKey } from "./environment";

interface IArtistOfTheWeek {
  artists: {
    artist: {
      name: string;
    }[];
  };
  error?: number;
  message?: string;
}
export async function getArtistsOfTheWeek(): Promise<IArtistOfTheWeek | null> {
  if (!lastFmApiKey) {
    console.error("No lastFmApiKey found");
    return null;
  }
  const artistsOfTheWeekRes = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${lastFmApiKey}&format=json`
  );
  const artistsOfTheWeek =
    (await artistsOfTheWeekRes.json()) as IArtistOfTheWeek;

  if (artistsOfTheWeek.error) {
    console.error(`${artistsOfTheWeek.error}: ${artistsOfTheWeek.message}`);
    return null;
  }

  if (!artistsOfTheWeekRes.ok) {
    return null;
  }

  return artistsOfTheWeek;
}
