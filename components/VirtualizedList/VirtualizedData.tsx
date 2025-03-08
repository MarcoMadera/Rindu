import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import { IndexRange } from "react-virtualized";

import VirtualizedList from "./VirtualizedList";
import { LoadingSpinner } from "components";
import { useSpotify } from "hooks";

interface VirtualizedDataProps<T> {
  id?: string;
  type: string;
  itemHeight: number | ((params: { index: number }) => number);
  totalItems?: number;
  fetchItems: (offset: number) => Promise<{
    items: T[];
    total: number;
  }>;
  isItemLoaded?: (item?: T) => boolean;
  checkItemsInLibrary?: (trackIds: string[]) => Promise<boolean[] | null>;
  getItemId: (item: T) => string;
  renderItem: (params: {
    key: string;
    item: T;
    style: React.CSSProperties;
    index: number;
    isInLibrary?: boolean;
  }) => ReactElement;
  emptyItem: T;
  initialItems?: T[] | null;
  initialItemsInLibrary?: boolean[] | null;
  batchSize?: number;
  transformItems?: (items: T[]) => T[];
  getSeparatorIndices?: (items: T[]) => Set<number>;
  getRealIndex?: (index: number, separatorIndices: Set<number>) => number;
}

export function VirtualizedData<T>({
  id,
  type,
  itemHeight,
  fetchItems,
  getItemId,
  renderItem,
  initialItems = null,
  initialItemsInLibrary = null,
  batchSize = 50,
  emptyItem,
  checkItemsInLibrary,
  isItemLoaded: externalIsItemLoaded,
  transformItems,
  getSeparatorIndices: getExternalSeparatorIndices,
  getRealIndex: getExternalRealIndex,
}: VirtualizedDataProps<T>): ReactElement {
  const { pageDetails } = useSpotify();
  const [items, setItems] = useState<T[] | null>(initialItems);
  const [itemsInLibrary, setItemsInLibrary] = useState<boolean[] | null>(
    initialItemsInLibrary
  );
  const [isLoading, setIsLoading] = useState(initialItems === null);
  const [totalItems, setTotalItems] = useState<number>(0);

  const getRangeStart = useCallback(
    (index: number) => Math.floor(index / batchSize) * batchSize,
    [batchSize]
  );
  const [loadedRanges, setLoadedRanges] = useState(() => {
    const initialRanges = new Set<string>();
    if (initialItems?.length) {
      const rangeStart = getRangeStart(0);
      initialRanges.add(`${rangeStart}`);
    }
    return initialRanges;
  });

  useEffect(() => {
    if (id && initialItems) {
      setItems(initialItems);
      setItemsInLibrary(initialItemsInLibrary);

      setLoadedRanges(() => {
        const initialRanges = new Set<string>();
        const rangeStart = getRangeStart(0);
        initialRanges.add(`${rangeStart}`);
        return initialRanges;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, initialItems, initialItemsInLibrary]);

  useEffect(() => {
    if (!initialItems) {
      const fetchInitialData = async () => {
        try {
          const response = await fetchItems(0);
          if (response.items) {
            const total = response.total;
            setTotalItems(total);

            const allItems = Array(total).fill(emptyItem);

            for (let i = 0; i < response.items.length; i++) {
              allItems[i] = response.items[i];
            }

            setItems(allItems);

            if (checkItemsInLibrary) {
              const ids = response.items
                .map((item) => getItemId(item))
                .filter(Boolean);
              if (ids.length > 0) {
                const inLibrary = await checkItemsInLibrary(ids);
                setItemsInLibrary(inLibrary);
              }
            }
          }
        } catch (error) {
          console.error(`Error loading initial ${type}:`, error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spliceItems = useCallback(
    <U,>(allItems: U[] | null, newItems: U[], position: number): U[] => {
      if (!allItems) {
        return [...newItems];
      }
      const updatedItems = [...allItems];
      for (let i = 0; i < newItems.length; i++) {
        updatedItems[position + i] = newItems[i];
      }
      return updatedItems;
    },
    []
  );

  const isIndexLoaded = useCallback(
    (index: number) => {
      const rangeStart = getRangeStart(index);
      const rangeKey = `${rangeStart}`;
      return loadedRanges.has(rangeKey);
    },
    [loadedRanges, getRangeStart]
  );

  const isItemLoaded = useCallback(
    (index: number) => {
      if (externalIsItemLoaded) {
        return externalIsItemLoaded(items?.[index]);
      }
      return !!items?.[index];
    },
    [items, externalIsItemLoaded]
  );

  const getDefaultRealIndex = useCallback(
    (index: number, separatorIndices: Set<number>) => {
      const separatorsBeforeIndex = Array.from(separatorIndices).filter(
        (sepIndex) => sepIndex < index
      ).length;
      return index - separatorsBeforeIndex;
    },
    []
  );

  const transformedItems = useMemo(() => {
    if (!items) return null;
    if (transformItems) {
      return transformItems(items);
    }
    return items;
  }, [items, transformItems]);

  const separatorIndices = useMemo(() => {
    if (!transformedItems || !getExternalSeparatorIndices) {
      return new Set<number>();
    }
    return getExternalSeparatorIndices(transformedItems);
  }, [transformedItems, getExternalSeparatorIndices]);

  const getRealIndex = useCallback(
    (index: number) => {
      if (getExternalRealIndex) {
        return getExternalRealIndex(index, separatorIndices);
      }
      return getDefaultRealIndex(index, separatorIndices);
    },
    [getExternalRealIndex, separatorIndices, getDefaultRealIndex]
  );

  const loadMoreItems = useCallback(
    async ({ startIndex, stopIndex }: IndexRange) => {
      if (startIndex === 0 && loadedRanges.has("0")) return;

      const rangeStart = getRangeStart(startIndex);
      const rangeEnd = getRangeStart(stopIndex);
      const rangesToLoad: number[] = [];

      for (let range = rangeStart; range <= rangeEnd; range += batchSize) {
        if (!isIndexLoaded(range)) {
          rangesToLoad.push(range);
        }
      }

      if (rangesToLoad.length === 0) return;

      setLoadedRanges((prev) => {
        const newRanges = new Set(prev);
        rangesToLoad.forEach((range) => newRanges.add(`${range}`));
        return newRanges;
      });

      const fetchDataForRange = async (offset: number) => {
        try {
          const response = await fetchItems(offset);
          if (!response?.items?.length) return null;

          const newItems = response.items;
          const ids = newItems.map((item) => getItemId(item)).filter(Boolean);

          let inLibrary: boolean[] | null = null;
          if (checkItemsInLibrary && ids.length > 0) {
            inLibrary = await checkItemsInLibrary(ids);
          }

          return { items: newItems, inLibrary, offset, total: response.total };
        } catch (error) {
          console.error(`Error loading ${type} at offset ${offset}:`, error);
          return null;
        }
      };

      const results = await Promise.allSettled(
        rangesToLoad.map(fetchDataForRange)
      );

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          const { items: newItems, inLibrary, offset } = result.value;

          setItems((currentItems) =>
            spliceItems(currentItems, newItems, offset)
          );

          if (inLibrary) {
            setItemsInLibrary((current) =>
              spliceItems(current, inLibrary, offset)
            );
          }
        }
      });
    },
    [
      batchSize,
      checkItemsInLibrary,
      fetchItems,
      getItemId,
      isIndexLoaded,
      loadedRanges,
      spliceItems,
      type,
      getRangeStart,
    ]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const getTotalItemsCount = () => {
    if (!initialItems) {
      return totalItems;
    }

    return (
      (pageDetails?.tracks?.total ?? items?.length ?? 0) +
      (separatorIndices.size >= 2 ? separatorIndices.size : 0)
    );
  };

  const totalItemCount = getTotalItemsCount();

  return (
    <div style={{ width: "100%" }}>
      <VirtualizedList
        items={transformedItems}
        defaultItem={emptyItem}
        totalItems={totalItemCount}
        itemHeight={itemHeight}
        loadMoreItems={loadMoreItems}
        overscanRowCount={batchSize / 2}
        isItemLoaded={isItemLoaded}
        scrollElementSelector={
          type === "playlist"
            ? "#left .simplebar-content-wrapper"
            : "#right .simplebar-content-wrapper"
        }
        renderItem={({ key, style, item, index }) => {
          const itemToRender = item || emptyItem;
          if (separatorIndices.has(index)) {
            return renderItem({
              key,
              item: itemToRender,
              style,
              index,
              isInLibrary: false,
            });
          }

          const realIndex = getRealIndex(index);

          const isInLibrary = itemsInLibrary
            ? itemsInLibrary[realIndex]
            : undefined;

          return renderItem({
            key,
            item: itemToRender,
            style,
            index: realIndex,
            isInLibrary,
          });
        }}
      />
    </div>
  );
}
