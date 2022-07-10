import { ITrack } from "types/spotify";

export function mapPlaylistItems(
  items: SpotifyApi.PlaylistTrackObject[] | undefined,
  startIndex: number
): ITrack[] {
  if (!items) return [];
  return items?.map(({ track, added_at, is_local }, i) => {
    const isCorrupted =
      !track?.name && !track?.artists?.[0]?.name && track?.duration_ms === 0;
    return {
      ...track,
      is_local,
      added_at,
      position: startIndex + i,
      corruptedTrack: isCorrupted,
    };
  });
}
