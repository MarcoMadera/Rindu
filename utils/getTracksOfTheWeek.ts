import { lastFmApiKey } from "./environment";

interface ITracksOfTheWeek {
  tracks: {
    track: {
      name: string;
      artist: {
        name: string;
      };
    }[];
  };
  error?: number;
  message?: string;
}

export async function getTracksOfTheWeek(): Promise<ITracksOfTheWeek | null> {
  if (!lastFmApiKey) {
    console.error("No lastFmApiKey found");
    return null;
  }
  const tracksOfTheWeekRes = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${lastFmApiKey}&format=json`
  );
  const tracksOfTheWeek = (await tracksOfTheWeekRes.json()) as ITracksOfTheWeek;
  if (tracksOfTheWeek.error) {
    console.error(`${tracksOfTheWeek.error}: ${tracksOfTheWeek.message}`);
    return null;
  }

  if (!tracksOfTheWeekRes.ok) {
    return null;
  }

  return tracksOfTheWeek;
}
