import { AllTracksFromAPlayList } from "types/spotify";

export function findDuplicateSongs(
  allTracks: AllTracksFromAPlayList
): number[] {
  const seenByIds: Record<string, boolean> = {};

  const seenByNameAndArtist: Record<string, number[]> = {};

  const duplicateSongs = allTracks.reduce(
    (duplicates: number[], track, index) => {
      if (track === null) return duplicates;
      if (!track.id) return duplicates;
      if (!track) return duplicates;
      let isDuplicate = false;
      const seenNameAndArtistKey = `${track.name}:${
        Array.isArray(track.artists) && track.artists[0].name
      }`.toLowerCase();
      if (track.id in seenByIds) {
        isDuplicate = true;
      } else {
        if (seenNameAndArtistKey in seenByNameAndArtist) {
          const similarDuration =
            seenByNameAndArtist[seenNameAndArtistKey].filter((duration) => {
              if (track.duration) {
                return Math.abs(duration - track.duration) < 2000;
              }

              return false;
            }).length !== 0;

          if (similarDuration) {
            isDuplicate = true;
          }
        }
      }

      if (isDuplicate) {
        duplicates.push(index);
      }

      if (!isDuplicate) {
        seenByIds[track.id] = true;
        seenByNameAndArtist[seenNameAndArtistKey] =
          seenByNameAndArtist[seenNameAndArtistKey] || [];
        seenByNameAndArtist[seenNameAndArtistKey].push(
          track.duration as number
        );
      }

      return duplicates;
    },
    []
  );

  return duplicateSongs;
}
