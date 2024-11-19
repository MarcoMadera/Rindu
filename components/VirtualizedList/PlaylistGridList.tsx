import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import { decode } from "html-entities";
import { debounce } from "lodash";
import {
  AutoSizer,
  Grid,
  GridCellProps,
  Index,
  IndexRange,
  InfiniteLoader,
  WindowScroller,
} from "react-virtualized";

import { RenderedSection } from "react-virtualized/dist/es/Grid";

import { CardType } from "components/CardContent";
import LikedSongsCard from "components/LikedSongsCard";
import PresentationCard from "components/PresentationCard";
import { getUserPlaylists } from "utils/spotifyCalls";

interface Props {
  translations: {
    pages: {
      collectionPlaylists: {
        by: string;
      };
    };
  };
  minCardWidth?: number;
  cardHeight?: number;
  gap?: number;
}

export function PlaylistGridList({
  translations,
  minCardWidth = 200,
  cardHeight = 299,
  gap = 24,
}: Readonly<Props>): ReactElement | null {
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);
  const [totalPlaylists, setTotalPlaylists] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [containerWidth, setContainerWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const scrollElement = document.querySelector(
        "#right .simplebar-content-wrapper"
      );
      return scrollElement ? scrollElement.clientWidth - 40 : 0;
    }
    return 0;
  });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchInitialPlaylists = async () => {
      try {
        const response = await getUserPlaylists(0);
        if (response?.items) {
          setPlaylists(response.items);
          setTotalPlaylists(response.total);
        }
      } catch (error) {
        console.error("Error loading initial playlists:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPlaylists();
  }, []);

  const { columnCount, columnWidth } = useMemo(() => {
    if (containerWidth === 0) return { columnCount: 0, columnWidth: 0 };

    const columnCount = Math.max(
      1,
      Math.floor((containerWidth + gap) / (minCardWidth + gap))
    );
    const columnWidth =
      (containerWidth - gap * (columnCount - 1)) / columnCount;

    return { columnCount, columnWidth };
  }, [containerWidth, minCardWidth, gap]);

  const cellRenderer = useCallback(
    ({ columnIndex, key, rowIndex, style }: GridCellProps) => {
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return (
            <div
              key={key}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: columnWidth * 2 + gap,
                height: cardHeight,
                zIndex: 123,
              }}
            >
              <LikedSongsCard />
            </div>
          );
        }
        if (columnIndex === 1) {
          return <div key={key} style={style} />;
        }
      }

      const firstRowOffset = 0;
      const index = rowIndex * columnCount + columnIndex - 2 + firstRowOffset;
      const playlist = playlists[index];

      if (!playlist || index >= totalPlaylists) {
        return (
          <div
            key={key}
            style={{
              position: "absolute",
              left: columnIndex * (columnWidth + gap),
              top: rowIndex * (cardHeight + gap),
              width: columnWidth,
              height: cardHeight,
            }}
          />
        );
      }

      return (
        <div
          key={key}
          style={{
            position: "absolute",
            left: columnIndex * (columnWidth + gap),
            top: rowIndex * (cardHeight + gap),
            width: columnWidth,
            height: cardHeight,
          }}
        >
          <PresentationCard
            type={CardType.PLAYLIST}
            images={playlist.images}
            title={playlist.name}
            subTitle={
              decode(playlist.description) ||
              `${translations.pages.collectionPlaylists.by} ${playlist.owner.display_name ?? playlist.owner.id}`
            }
            id={playlist.id}
          />
        </div>
      );
    },
    [
      playlists,
      columnCount,
      columnWidth,
      cardHeight,
      gap,
      totalPlaylists,
      translations,
    ]
  );

  const rowCount = Math.ceil((totalPlaylists + 2) / columnCount);

  const loadMoreRows = useCallback(
    async ({ startIndex }: IndexRange) => {
      if (isLoadingMore) return;

      const offset = Math.floor((startIndex * columnCount) / 50) * 50;
      if (offset >= totalPlaylists) return;

      try {
        setIsLoadingMore(true);
        const response = await getUserPlaylists(offset);

        if (response?.items) {
          setPlaylists((current) => {
            if (current[offset]) return current;

            const newPlaylists = [...current];
            response.items.forEach((item, index) => {
              newPlaylists[offset + index] = item;
            });
            return newPlaylists;
          });
        }
      } catch (error) {
        console.error("Error loading more playlists:", error);
      } finally {
        setIsLoadingMore(false);
      }
    },
    [columnCount, totalPlaylists, isLoadingMore]
  );

  const isRowLoaded = useCallback(
    ({ index }: Index) => {
      const startIndex = index * columnCount;
      return Boolean(playlists[startIndex]);
    },
    [playlists, columnCount]
  );

  useEffect(() => {
    const handleResize = () => {
      const scrollElement = document.querySelector(
        "#right .simplebar-content-wrapper"
      );
      if (scrollElement) {
        setContainerWidth(scrollElement.clientWidth - 40);
      }
    };

    handleResize();

    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  if (isLoading || containerWidth === 0) {
    return <div>Loading playlists...</div>;
  }

  const scrollElement =
    typeof window !== "undefined"
      ? (document.querySelector(
          "#right .simplebar-content-wrapper"
        ) as HTMLElement)
      : undefined;

  if (!scrollElement) return null;

  return (
    <div style={{ width: "100%", paddingBottom: "80px" }}>
      <WindowScroller scrollElement={scrollElement}>
        {({ height, isScrolling, scrollTop, onChildScroll }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <InfiniteLoader
                isRowLoaded={isRowLoaded}
                loadMoreRows={loadMoreRows}
                rowCount={rowCount}
                minimumBatchSize={Math.ceil(50 / columnCount)}
                threshold={50}
              >
                {({ onRowsRendered }) => {
                  const onSectionRendered = ({
                    rowStartIndex,
                    rowStopIndex,
                  }: RenderedSection) => {
                    onRowsRendered({
                      startIndex: rowStartIndex,
                      stopIndex: rowStopIndex,
                    });
                  };
                  return (
                    <Grid
                      autoHeight
                      cellRenderer={cellRenderer}
                      columnCount={columnCount}
                      columnWidth={columnWidth + gap}
                      height={height}
                      isScrolling={isScrolling}
                      rowCount={rowCount}
                      rowHeight={cardHeight + gap}
                      scrollTop={scrollTop}
                      width={width}
                      onScroll={onChildScroll}
                      onSectionRendered={onSectionRendered}
                      overscanRowCount={5}
                      style={{
                        overflowX: "hidden",
                        overflowY: "hidden",
                        width: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    />
                  );
                }}
              </InfiniteLoader>
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    </div>
  );
}
