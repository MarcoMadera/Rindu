import {
  ArtistScrobbleInfo,
  fullFilledValue,
  getArtistScrobbleInfo,
  getMBID,
  getMusicFanArt,
} from "utils";

export async function getArtistInfo(
  artistName?: string
): Promise<ArtistScrobbleInfo | null> {
  if (!artistName) return null;
  try {
    const [artistScrobbleInfoSettled, mbidSettled] = await Promise.allSettled([
      getArtistScrobbleInfo(artistName),
      getMBID(artistName),
    ]);

    const artistScrobbleInfo = fullFilledValue(artistScrobbleInfoSettled);
    const mbid = fullFilledValue(mbidSettled) || artistScrobbleInfo?.mbid;
    const artistInfo = artistScrobbleInfo || ({} as ArtistScrobbleInfo);

    if (mbid) {
      const musicFanArt = await getMusicFanArt(mbid);
      if (musicFanArt) {
        const banner = musicFanArt?.artistbackground?.[0]?.url;
        if (banner) {
          artistInfo.banner = "/_next/image?url=" + banner + "&w=2048&q=100";
        }
        artistInfo.thumb = musicFanArt?.artistthumb?.[0]?.url;
      }
    }
    return artistInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
}
