import { ITrack } from "types/spotify";
import { ACCESS_TOKEN_COOKIE, isCorruptedTrack, takeCookie } from "utils";

export async function getAllTracksFromPlaylist(
  id: string | undefined,
  totalTracks: number,
  isLibrary: boolean
): Promise<ITrack[]> {
  let tracks: ITrack[] = [];
  const limit = isLibrary ? 50 : 100;
  const max = Math.ceil(totalTracks / limit);
  const accessToken = takeCookie(ACCESS_TOKEN_COOKIE);
  for (let i = 0; i < max; i++) {
    const res = await fetch(
      `https://api.spotify.com/v1/${
        !isLibrary ? `playlists/${id ?? ""}` : "me"
      }/tracks?limit=${limit}&offset=${limit * i}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = (await res.json()) as
      | SpotifyApi.PlaylistTrackResponse
      | undefined;
    const newTracks: ITrack[] | undefined = data?.items?.map(
      ({ track, added_at, is_local }, index) => {
        return {
          ...track,
          corruptedTrack: isCorruptedTrack(track),
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
