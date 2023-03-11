import { ITrack } from "types/spotify";
import { findDuplicateSongs } from "utils/findDuplicateSongs";
import { getAllTracksFromPlaylist } from "utils/getAllTracksFromPlaylist";

export async function analyzePlaylist(
  id: string | undefined,
  totalTracks: number | undefined,
  isLibrary: boolean,
  accessToken: string
): Promise<{
  tracks: ITrack[];
  duplicateTracksIndexes: number[];
  corruptedSongsIndexes: number[];
  tracksToRemove: ITrack[];
} | null> {
  if (!id || !accessToken || !totalTracks) {
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

export default analyzePlaylist;
