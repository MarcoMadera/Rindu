import { ReactElement, useCallback, useEffect, useState } from "react";

import { IndexRange } from "react-virtualized";

import VirtualizedList from "./VirtualizedList";
import LoadingSpinner from "components/LoadingSpinner";
import PlaylistText from "components/PlaylistText";
import { getUserPlaylists } from "utils/spotifyCalls";

export function PlaylistsList(): ReactElement {
  const [playlists, setPlaylists] = useState<
    SpotifyApi.PlaylistObjectSimplified[] | null
  >(null);
  const [totalPlaylists, setTotalPlaylists] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialPlaylists = async () => {
      try {
        const response = await getUserPlaylists(0);

        if (response?.items) {
          const initialPlaylists = response.items;

          setPlaylists(initialPlaylists);
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

  const splicePlaylists = useCallback(
    (
      allPlaylists: SpotifyApi.PlaylistObjectSimplified[] | null,
      newPlaylists: SpotifyApi.PlaylistObjectSimplified[],
      position: number
    ): SpotifyApi.PlaylistObjectSimplified[] => {
      if (!allPlaylists) {
        return [...newPlaylists];
      }
      const updatedPlaylists = [...allPlaylists];
      updatedPlaylists.splice(position, 50, ...newPlaylists);
      return updatedPlaylists;
    },
    []
  );

  const loadMorePlaylists = useCallback(
    async ({ startIndex }: IndexRange) => {
      if (startIndex === 0) return;

      try {
        const offset = Math.floor(startIndex / 50) * 50;

        const response = await getUserPlaylists(offset);

        if (response?.items) {
          const newPlaylists = response.items;

          setPlaylists((currentPlaylists) =>
            splicePlaylists(currentPlaylists, newPlaylists, startIndex)
          );

          if (startIndex === 0) {
            setTotalPlaylists(response.total);
          }
        }
      } catch (error) {
        console.error("Error loading playlists:", error);
      }
    },
    [splicePlaylists]
  );

  const isItemLoaded = useCallback(
    (index: number) => {
      return !!playlists?.[index]?.uri;
    },
    [playlists]
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ width: "100%" }}>
      <VirtualizedList
        scrollElementSelector="#left .simplebar-content-wrapper"
        items={playlists}
        totalItems={totalPlaylists}
        itemHeight={26}
        loadMoreItems={loadMorePlaylists}
        isItemLoaded={isItemLoaded}
        renderItem={({ key, item: playlist, style }) => (
          <PlaylistText
            key={key}
            style={style}
            id={playlist?.id ?? ""}
            uri={playlist?.uri ?? ""}
            name={playlist?.name ?? ""}
            type={"playlist"}
          />
        )}
      />
    </div>
  );
}
