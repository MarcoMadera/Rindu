import { ITrack } from "types/spotify";

export async function getAllTracksFromPlaylist(
  id: string | undefined,
  totalTracks: number,
  isLibrary: boolean,
  accessToken: string
): Promise<ITrack[]> {
  let tracks: ITrack[] = [];
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
    const newTracks: ITrack[] | undefined = data?.items?.map(
      ({ track, added_at, is_local }, index) => {
        const isCorrupted =
          !track?.name &&
          !track?.artists?.[0]?.name &&
          track?.duration_ms === 0;
        return {
          ...track,
          corruptedTrack: isCorrupted,
          position: limit * i + index,
          added_at,
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
