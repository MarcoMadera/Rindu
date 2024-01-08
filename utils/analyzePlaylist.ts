import { ReactNode } from "react";

import { ITrack } from "types/spotify";
import { findDuplicateSongs } from "utils/findDuplicateSongs";
import { getAllTracksFromPlaylist } from "utils/getAllTracksFromPlaylist";
import { templateReplace } from "utils/templateReplace";

function getSummary(
  res: {
    tracks: ITrack[];
    duplicateTracksIndexes: number[];
    corruptedSongsIndexes: number[];
    tracksToRemove: ITrack[];
  },
  translations: Record<string, string>
): string | ReactNode[] {
  const has0DuplicateTracks = res.duplicateTracksIndexes.length === 0;
  const has0CorruptedSongs = res.corruptedSongsIndexes.length === 0;
  const hasSingleDuplicateTrack = res.duplicateTracksIndexes.length === 1;
  const hasSingleCorruptedTrack = res.corruptedSongsIndexes.length === 1;
  const hasMultipleDuplicateTracks = res.duplicateTracksIndexes.length > 1;
  const hasMultipleCorruptedTracks = res.corruptedSongsIndexes.length > 1;

  if (has0DuplicateTracks && has0CorruptedSongs) {
    return translations.noCorruptOrDuplicateSongs;
  }

  if (hasSingleDuplicateTrack && hasSingleCorruptedTrack) {
    return translations.oneDuplicateOneCorrupt;
  }

  if (hasSingleDuplicateTrack && has0CorruptedSongs) {
    return translations.oneDuplicate;
  }

  if (has0DuplicateTracks && hasSingleCorruptedTrack) {
    return translations.oneCorrupt;
  }

  if (has0DuplicateTracks && hasMultipleCorruptedTracks) {
    return templateReplace(translations.multipleCorrupt, [
      res.corruptedSongsIndexes.length,
    ]);
  }

  if (hasMultipleDuplicateTracks && has0CorruptedSongs) {
    return templateReplace(translations.multipleDuplicate, [
      res.duplicateTracksIndexes.length,
    ]);
  }

  return templateReplace(translations.multipleCorruptAndMultipleDuplicate, [
    res.corruptedSongsIndexes.length,
    res.duplicateTracksIndexes.length,
  ]);
}

export async function analyzePlaylist(
  id: string | undefined,
  totalTracks: number | undefined,
  isLibrary: boolean,
  translations: Record<string, string>
): Promise<{
  tracks: ITrack[];
  duplicateTracksIndexes: number[];
  corruptedSongsIndexes: number[];
  tracksToRemove: ITrack[];
  summary: string | ReactNode[];
} | null> {
  if (!id || !totalTracks) {
    return null;
  }
  const tracks = await getAllTracksFromPlaylist(id, totalTracks, isLibrary);
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

  const summary = getSummary(
    {
      tracks,
      duplicateTracksIndexes,
      corruptedSongsIndexes,
      tracksToRemove,
    },
    translations
  );

  return {
    tracks,
    duplicateTracksIndexes,
    corruptedSongsIndexes,
    tracksToRemove,
    summary,
  };
}

export default analyzePlaylist;
