import { ITrack } from "types/spotify";

export function isCorruptedTrack(track: ITrack | null): boolean {
  const isCorrupted =
    !track?.name && !track?.artists?.[0]?.name && track?.duration_ms === 0;
  return isCorrupted;
}
