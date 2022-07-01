import { AllTracksFromAPlayList } from "types/spotify";

export async function getAllTracksFromPlaylist(
  id: string | undefined,
  totalTracks: number,
  isLibrary: boolean,
  accessToken: string
): Promise<AllTracksFromAPlayList> {
  let tracks: AllTracksFromAPlayList = [];
  const limit = isLibrary ? 50 : 100;
  const max = Math.ceil(totalTracks / limit);

  for (let i = 0; i < max; i++) {
    const res = await fetch(
      `https://api.spotify.com/v1/${
        !isLibrary ? `playlists/${id}` : "me"
      }/tracks?limit=${limit}&offset=${limit * i}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data: SpotifyApi.PlaylistTrackResponse | undefined = await res.json();
    const newTracks: AllTracksFromAPlayList | undefined = data?.items?.map(
      ({ track, added_at, is_local }, index) => {
        const isCorrupted =
          !track?.name &&
          !track?.artists?.[0]?.name &&
          track?.duration_ms === 0;
        return {
          name: track?.name,
          images: track?.album.images,
          uri: track?.uri,
          href: track?.external_urls.spotify,
          artists: track?.artists,
          id: track?.id,
          explicit: track?.explicit,
          duration: track?.duration_ms,
          audio: track?.preview_url,
          corruptedTrack: isCorrupted,
          position: limit * i + index,
          album: track?.album,
          added_at,
          type: track?.type,
          media_type: "audio",
          is_playable: track?.is_playable,
          is_local,
        };
      }
    );
    if (newTracks) {
      tracks = [...tracks, ...newTracks];
    }
  }
  return tracks;
}
