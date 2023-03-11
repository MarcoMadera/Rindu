import { ITrack } from "types/spotify";

export function findDuplicateSongs(allTracks: ITrack[]): {
  index: number;
  id: string | null;
}[] {
  const seenByIds: Record<string, boolean> = {};

  const seenByNameAndArtist: Record<string, number[]> = {};

  const duplicateSongs = allTracks.reduce(
    (duplicates: { index: number; id: string }[], track, index) => {
      if (
        !track ||
        !track.id ||
        !track.name ||
        !Array.isArray(track.artists) ||
        !track.artists[0].name
      ) {
        return duplicates;
      }

      let isDuplicate = false;
      const seenNameAndArtistKey =
        `${track.name}:${track.artists[0].name}`.toLowerCase();
      if (track.id in seenByIds) {
        isDuplicate = true;
      } else {
        if (seenNameAndArtistKey in seenByNameAndArtist) {
          const similarDuration =
            seenByNameAndArtist[seenNameAndArtistKey].filter((duration) => {
              if (track.duration_ms) {
                return Math.abs(duration - track.duration_ms) < 2000;
              }

              return false;
            }).length !== 0;

          if (similarDuration) {
            isDuplicate = true;
          }
        }
      }

      if (isDuplicate) {
        duplicates.push({ index, id: track.id });
      }

      if (!isDuplicate) {
        seenByIds[track.id] = true;
        seenByNameAndArtist[seenNameAndArtistKey] =
          seenByNameAndArtist[seenNameAndArtistKey] || [];
        seenByNameAndArtist[seenNameAndArtistKey].push(
          track.duration_ms as number
        );
      }

      return duplicates;
    },
    []
  );

  return duplicateSongs;
}

export default findDuplicateSongs;
