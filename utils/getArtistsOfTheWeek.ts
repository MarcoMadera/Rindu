interface IArtistOfTheWeek {
  artists: {
    artist: {
      name: string;
    }[];
  };
  error?: number;
  message?: string;
}
export async function getArtistsOfTheWeek(
  apiKey: string
): Promise<IArtistOfTheWeek | null> {
  const artistsOfTheWeekRes = await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json`
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
