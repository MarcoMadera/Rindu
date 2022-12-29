import CardTrack from "components/CardTrack";
import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import { ReactElement, useCallback, useState } from "react";
import {
  AutoSizer,
  IndexRange,
  InfiniteLoader,
  List,
  WindowScroller,
} from "react-virtualized";
import { ITrack } from "types/spotify";
import { isServer } from "utils/environment";
import { getTracksFromLibrary } from "utils/getTracksFromLibrary";
import { mapPlaylistItems } from "utils/mapPlaylistItems";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";
import { getTracksFromPlaylist } from "utils/spotifyCalls/getTracksFromPlayList";

interface Props {
  type: "playlist" | "album" | "presentation";
  initialTracksInLibrary: boolean[] | null;
  isLibrary?: boolean;
  isGeneratedPlaylist?: boolean;
}

export default function VirtualizedList({
  type,
  initialTracksInLibrary,
  isLibrary,
  isGeneratedPlaylist,
}: Props): ReactElement | null {
  const { allTracks, pageDetails, setAllTracks } = useSpotify();
  const { accessToken } = useAuth();
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
        ? await getTracksFromLibrary(startIndex, accessToken)
        : await getTracksFromPlaylist(
            pageDetails?.id ?? "",
            startIndex,
            accessToken
          );
      const items = data?.items;
      const tracks = mapPlaylistItems(items, startIndex);
      if (!tracks) return;
      const trackIds = tracks.map((track) => track.id ?? "");
      const tracksInLibrary = await checkTracksInLibrary(
        trackIds,
        accessToken || ""
      );
      addTracksToPlaylists(tracks, tracksInLibrary, startIndex);
    },
    [
      accessToken,
      addTracksToPlaylists,
      isGeneratedPlaylist,
      isLibrary,
      pageDetails?.id,
    ]
  );

  const scrollElement = !isServer()
    ? document?.getElementsByClassName("app")?.[0]
    : undefined;
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
                    (pageDetails?.tracks?.total || allTracks?.length) ?? 0
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
                        (pageDetails?.tracks?.total || allTracks?.length) ?? 0
                      }
                      rowHeight={65}
                      scrollTop={scrollTop}
                      width={width}
                      rowRenderer={({ index, style, key }) => {
                        return (
                          <CardTrack
                            accessToken={accessToken}
                            key={key}
                            style={style}
                            track={allTracks?.[index]}
                            playlistUri={pageDetails?.uri ?? ""}
                            isTrackInLibrary={
                              tracksInLibrary?.[
                                allTracks?.[index]?.position ?? -1
                              ]
                            }
                            isSingleTrack={isGeneratedPlaylist}
                            type={type}
                            position={allTracks?.[index]?.position}
                            allTracks={allTracks}
                          />
                        );
                      }}
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
