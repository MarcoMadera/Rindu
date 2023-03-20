interface IArtistOfTheWeek {
  artists: {
    artist: {
      name: string;
    }[];
  };
}
export async function getArtistsOfTheWeek(
  apiKey: string
): Promise<IArtistOfTheWeek> {
  const artistsOfTheWeekRes = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json`
  );
  const artistsOfTheWeek =
    (await artistsOfTheWeekRes.json()) as IArtistOfTheWeek;
  return artistsOfTheWeek;
}
