import { CSSProperties, ReactElement, useCallback } from "react";

import {
  AutoSizer,
  IndexRange,
  InfiniteLoader,
  List,
  WindowScroller,
} from "react-virtualized";

interface ItemRendererProps<T> {
  key: string;
  style: CSSProperties;
  index: number;
  item: T | undefined;
  additionalProps?: Record<string, any>;
}

interface VirtualizedListProps<T> {
  items: T[] | null;
  defaultItem?: T;
  totalItems: number;
  itemHeight: number;
  loadMoreItems?: (range: IndexRange) => Promise<void>;
  renderItem: (props: ItemRendererProps<T>) => ReactElement;
  isItemLoaded?: (index: number) => boolean;
  scrollElementSelector?: string;
  overscanRowCount?: number;
  additionalProps?: Record<string, any>;
}

export default function VirtualizedList<T>({
  items,
  defaultItem,
  totalItems,
  itemHeight,
  loadMoreItems,
  renderItem,
  isItemLoaded,
  scrollElementSelector = "#right .simplebar-content-wrapper",
  overscanRowCount = 2,
}: Readonly<VirtualizedListProps<T>>): ReactElement | null {
  const scrollElement =
    typeof window !== "undefined"
      ? (document.querySelector(scrollElementSelector) as HTMLElement)
      : undefined;

  const defaultIsItemLoaded = useCallback(
    (index: number) => !!items?.[index],
    [items]
  );

  const handleLoadMoreRows = useCallback(
    async (range: IndexRange) => {
      if (loadMoreItems) {
        await loadMoreItems(range);
      }
    },
    [loadMoreItems]
  );

  function rowRenderer({
    key,
    style,
    index,
  }: {
    key: string;
    style: CSSProperties;
    index: number;
  }) {
    return renderItem({
      key,
      style: style,
      index,
      item: items?.[index] ?? defaultItem,
    });
  }

  if (!scrollElement) return null;

  return (
    <WindowScroller scrollElement={scrollElement}>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <InfiniteLoader
              isRowLoaded={({ index }) =>
                (isItemLoaded ?? defaultIsItemLoaded)(index)
              }
              loadMoreRows={handleLoadMoreRows}
              rowCount={totalItems}
              minimumBatchSize={50}
              threshold={0}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  autoHeight
                  height={height ?? 0}
                  isScrolling={isScrolling}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  onScroll={onChildScroll}
                  overscanRowCount={overscanRowCount}
                  rowCount={totalItems}
                  rowHeight={itemHeight}
                  scrollTop={scrollTop}
                  width={width}
                  rowRenderer={rowRenderer}
                  tabIndex={-1}
                />
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
}
