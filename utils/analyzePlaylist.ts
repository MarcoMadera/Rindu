import { AllTracksFromAPlayList, normalTrackTypes } from "types/spotify";
import { findDuplicateSongs } from "./findDuplicateSongs";
import { getAllTracksFromPlaylist } from "./getAllTracksFromPlaylist";

export async function analyzePlaylist(
  id: string,
  totalTracks: number,
  isLibrary: boolean,
  accessToken: string
): Promise<{
  tracks: AllTracksFromAPlayList;
  duplicateTracksIndexes: number[];
  corruptedSongsIndexes: number[];
  tracksToRemove: normalTrackTypes[];
} | null> {
  if (!id || !accessToken) {
    return null;
  }
  const tracks = await getAllTracksFromPlaylist(
    id,
    totalTracks,
    isLibrary,
    accessToken
  );
  const duplicatesTracksIdxId = findDuplicateSongs(tracks);
  const duplicateTracksIndexes = duplicatesTracksIdxId.map(({ index }) => {
    return index;
  });
  const corruptedSongsIndexes = tracks
    .filter((track) => {
      return track.corruptedTrack;
    })
    .map((track) => {
      return track.position ?? 0;
    });
  const tracksToRemoveIdx = [
    ...new Set([...corruptedSongsIndexes, ...duplicateTracksIndexes]),
  ];
  const tracksToRemove = tracksToRemoveIdx
    .map((index) => {
      return tracks[index];
    })
    .sort((a, b) => {
      if (a.position && b.position) {
        return a.position - b.position;
      }
      return 0;
    });

  return {
    tracks,
    duplicateTracksIndexes,
    corruptedSongsIndexes,
    tracksToRemove,
  };
}
