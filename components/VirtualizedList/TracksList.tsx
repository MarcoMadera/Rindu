import { ReactElement, useCallback, useState } from "react";

import { IndexRange } from "react-virtualized";

import VirtualizedList from "./VirtualizedList";
import CardTrack, { CardType } from "components/CardTrack";
import { useSpotify } from "hooks";

import { ITrack } from "types/spotify";
import { getIdFromUri, mapPlaylistItems } from "utils";
import {
  checkTracksInLibrary,
  getMyLikedSongs,
  getTracksFromPlaylist,
} from "utils/spotifyCalls";

interface Props {
  type: CardType;
  initialTracksInLibrary: boolean[] | null;
  isLibrary?: boolean;
  isGeneratedPlaylist?: boolean;
}

export function TracksList({
  isGeneratedPlaylist,
  isLibrary,
  type,
  initialTracksInLibrary,
}: Readonly<Props>): ReactElement {
  const { allTracks, pageDetails, setAllTracks } = useSpotify();
  const [tracksInLibrary, setTracksInLibrary] = useState<boolean[] | null>(
    initialTracksInLibrary
  );
  const BATCH_SIZE = 50;

  const spliceTracks = useCallback(
    <T,>(allTracks: T[] | null, newTracks: T[], position: number): T[] => {
      if (!allTracks) {
        return [...newTracks];
      }
      const tracks = [...allTracks];
      tracks.splice(position, BATCH_SIZE, ...newTracks);
      return tracks;
    },
    []
  );

  const addTracksToPlaylists = useCallback(
    (
      tracks: ITrack[],
      tracksInLibrary: boolean[] | null,
      position: number
    ): void => {
      setAllTracks((allTracks) => spliceTracks(allTracks, tracks, position));

      if (!tracksInLibrary) return;

      setTracksInLibrary((allTracks) =>
        spliceTracks(allTracks, tracksInLibrary, position)
      );
    },
    [setAllTracks, spliceTracks]
  );

  const isItemLoaded = useCallback(
    (index: number) => {
      return !!allTracks?.[index]?.name;
    },
    [allTracks]
  );

  const [loadedRanges, setLoadedRanges] = useState(new Set());

  const getRangeStart = (index: number) =>
    Math.floor(index / BATCH_SIZE) * BATCH_SIZE;

  const isIndexLoaded = useCallback(
    (startIndex: number) => {
      const rangeStart = getRangeStart(startIndex);
      const rangeKey = `${rangeStart}`;
      return loadedRanges.has(rangeKey);
    },
    [loadedRanges]
  );

  const loadMoreRows = useCallback(
    async ({ startIndex }: IndexRange) => {
      if (isIndexLoaded(startIndex)) {
        return;
      }
      const rangeStart = getRangeStart(startIndex);

      if (isGeneratedPlaylist) return;
      setLoadedRanges((prev) => {
        const newRanges = new Set(prev);
        newRanges.add(`${rangeStart}`);
        return newRanges;
      });
      const data = isLibrary
        ? await getMyLikedSongs(BATCH_SIZE, startIndex)
        : await getTracksFromPlaylist(
            getIdFromUri(pageDetails?.uri, "id") ?? "",
            rangeStart
          );
      const items = data?.items;
      const tracks = mapPlaylistItems(items, startIndex);
      if (!tracks) return;
      const trackIds = tracks.map((track) => track.id ?? "");

      const tracksInLibrary = await checkTracksInLibrary(trackIds);

      addTracksToPlaylists(tracks, tracksInLibrary, rangeStart);
    },
    [
      addTracksToPlaylists,
      isGeneratedPlaylist,
      isLibrary,
      pageDetails?.uri,
      isIndexLoaded,
    ]
  );

  return (
    <VirtualizedList
      items={allTracks}
      totalItems={pageDetails?.tracks?.total ?? allTracks?.length ?? 0}
      itemHeight={65}
      loadMoreItems={loadMoreRows}
      isItemLoaded={isItemLoaded}
      renderItem={({ key, style, item: track }) => (
        <CardTrack
          key={key}
          style={style}
          track={track}
          playlistUri={pageDetails?.uri ?? ""}
          isTrackInLibrary={tracksInLibrary?.[track?.position ?? -1]}
          isSingleTrack={isGeneratedPlaylist}
          type={type}
          position={track?.position}
        />
      )}
    />
  );
}
