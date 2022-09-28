export interface Artist {
  idArtist: string;
  strArtist: string;
  strArtistStripped: null;
  strArtistAlternate: string;
  strLabel: string;
  idLabel: string;
  intFormedYear: string;
  intBornYear: string;
  intDiedYear: null;
  strDisbanded: null;
  strStyle: string;
  strGenre: string;
  strMood: string;
  strWebsite: string;
  strFacebook: string;
  strTwitter: string;
  strGender: string;
  intMembers: string;
  strCountry: string;
  strCountryCode: string;
  strArtistThumb: string;
  strArtistLogo: string;
  strArtistCutout: string;
  strArtistClearart: string;
  strArtistWideThumb: string;
  strArtistFanart: string;
  strArtistFanart2: string;
  strArtistFanart3: string;
  strArtistFanart4: string;
  strArtistBanner: string;
  strMusicBrainzID: string;
  strISNIcode: null;
  strLastFMChart: string;
  intCharted: string;
  strLocked: string;
  strBiographyEN: string | null;
  strBiographyDE: string | null;
  strBiographyFR: string | null;
  strBiographyCN: string | null;
  strBiographyIT: string | null;
  strBiographyJP: string | null;
  strBiographyRU: string | null;
  strBiographyES: string | null;
  strBiographyPT: string | null;
  strBiographySE: string | null;
  strBiographyNL: string | null;
  strBiographyHU: string | null;
  strBiographyNO: string | null;
  strBiographyIL: string | null;
  strBiographyPL: string | null;
}

export interface ArtistsInfo {
  artists: Artist[];
}

export async function getArtistInfo(
  artistName?: string
): Promise<ArtistsInfo | null> {
  if (!artistName) return null;
  try {
    const res = await fetch(
      `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${artistName}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (res.ok) {
      const data: ArtistsInfo = await res.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
