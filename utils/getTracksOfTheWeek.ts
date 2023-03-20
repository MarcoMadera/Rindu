interface ITracksOfTheWeek {
  tracks: {
    track: {
      name: string;
      artist: {
        name: string;
      };
    }[];
  };
}

export async function getTracksOfTheWeek(
  apiKey: string
): Promise<ITracksOfTheWeek> {
  const tracksOfTheWeekRes = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${apiKey}&format=json`
  );
  const tracksOfTheWeek = (await tracksOfTheWeekRes.json()) as ITracksOfTheWeek;
  return tracksOfTheWeek;
}
