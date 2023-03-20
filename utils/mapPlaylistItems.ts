import { ITrack } from "types/spotify";
import { isCorruptedTrack } from "utils";

export function mapPlaylistItems(
  items: SpotifyApi.PlaylistTrackObject[] | undefined | null,
  startIndex: number
): ITrack[] {
  if (!items) return [];
  return items.map(({ track, added_at, is_local }, i) => {
    return {
      ...track,
      is_local,
      added_at,
      position: startIndex + i,
      corruptedTrack: isCorruptedTrack(track),
    };
  });
}
