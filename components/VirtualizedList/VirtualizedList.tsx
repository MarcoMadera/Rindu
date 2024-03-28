import { CSSProperties, ReactElement, useCallback, useState } from "react";

import {
  AutoSizer,
  IndexRange,
  InfiniteLoader,
  List,
  WindowScroller,
} from "react-virtualized";

import { CardTrack } from "components";
import { CardType } from "components/CardTrack/CardTrack";
import { useSpotify } from "hooks";
import { ITrack } from "types/spotify";
import { getIdFromUri, isServer, mapPlaylistItems } from "utils";
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

export default function VirtualizedList({
  type,
  initialTracksInLibrary,
  isLibrary,
  isGeneratedPlaylist,
}: Readonly<Props>): ReactElement | null {
  const { allTracks, pageDetails, setAllTracks } = useSpotify();
  const [tracksInLibrary, setTracksInLibrary] = useState<boolean[] | null>(
    initialTracksInLibrary
  );

  const spliceTracks = useCallback(
    <T,>(allTracks: T[] | null, newTracks: T[], position: number): T[] => {
      if (!allTracks) {
        return [...newTracks];
      }
      const tracks = [...allTracks];
      tracks.splice(position, 50, ...newTracks);
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

  const loadMoreRows = useCallback(
    async ({ startIndex }: IndexRange) => {
      if (isGeneratedPlaylist) return;
      const data = isLibrary
        ? await getMyLikedSongs(50, startIndex)
        : await getTracksFromPlaylist(
            getIdFromUri(pageDetails?.uri, "id") ?? "",
            startIndex
          );
      const items = data?.items;
      const tracks = mapPlaylistItems(items, startIndex);
      if (!tracks) return;
      const trackIds = tracks.map((track) => track.id ?? "");
      const tracksInLibrary = await checkTracksInLibrary(trackIds);
      addTracksToPlaylists(tracks, tracksInLibrary, startIndex);
    },
    [addTracksToPlaylists, isGeneratedPlaylist, isLibrary, pageDetails?.uri]
  );

  const scrollElement = !isServer()
    ? (document.querySelector(
        "#right .simplebar-content-wrapper"
      ) as HTMLElement)
    : undefined;

  function rowRenderer({
    key,
    style,
    index,
  }: Readonly<{
    key: string;
    style: CSSProperties;
    index: number;
  }>) {
    return (
      <CardTrack
        key={key}
        style={style}
        track={allTracks?.[index]}
        playlistUri={pageDetails?.uri ?? ""}
        isTrackInLibrary={tracksInLibrary?.[allTracks?.[index]?.position ?? -1]}
        isSingleTrack={isGeneratedPlaylist}
        type={type}
        position={allTracks?.[index]?.position}
      />
    );
  }

  return (
    <WindowScroller scrollElement={scrollElement}>
      {({ height, isScrolling, onChildScroll, scrollTop }) => {
        return (
          <AutoSizer disableHeight>
            {({ width }) => {
              return (
                <InfiniteLoader
                  isRowLoaded={({ index }) => {
                    return !!allTracks?.[index]?.name;
                  }}
                  loadMoreRows={loadMoreRows}
                  rowCount={
                    pageDetails?.tracks?.total ?? allTracks?.length ?? 0
                  }
                >
                  {({ onRowsRendered, registerChild }) => (
                    <List
                      autoHeight
                      height={height ?? 0}
                      isScrolling={isScrolling}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                      onScroll={onChildScroll}
                      overscanRowCount={2}
                      rowCount={
                        pageDetails?.tracks?.total ?? allTracks?.length ?? 0
                      }
                      rowHeight={65}
                      scrollTop={scrollTop}
                      width={width}
                      rowRenderer={rowRenderer}
                      tabIndex={-1}
                    />
                  )}
                </InfiniteLoader>
              );
            }}
          </AutoSizer>
        );
      }}
    </WindowScroller>
  );
}
