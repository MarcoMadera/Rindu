import { CSSProperties, ReactElement } from "react";

import { VirtualizedData } from "./VirtualizedData";
import PlaylistText from "components/PlaylistText";
import { getUserPlaylists } from "utils/spotifyCalls";

export function PlaylistsList(): ReactElement {
  const fetchPlaylists = async (offset: number) => {
    try {
      const response = await getUserPlaylists(offset);
      return {
        items: response?.items || [],
        total: response?.total || 0,
      };
    } catch (error) {
      console.error("Error loading playlists:", error);
      return { items: [], total: 0 };
    }
  };

  const getPlaylistId = (playlist: SpotifyApi.PlaylistObjectSimplified) => {
    return playlist?.id || "";
  };

  const renderPlaylistItem = ({
    key,
    item: playlist,
    style,
  }: {
    key: string;
    item: SpotifyApi.PlaylistObjectSimplified;
    style: CSSProperties;
  }) => (
    <PlaylistText
      key={key}
      style={style}
      id={playlist?.id ?? ""}
      uri={playlist?.uri ?? ""}
      name={playlist?.name ?? ""}
      type={"playlist"}
    />
  );

  const isItemLoaded = (playlist?: SpotifyApi.PlaylistObjectSimplified) => {
    return !!playlist?.uri;
  };

  return (
    <VirtualizedData
      type="playlist"
      itemHeight={26}
      fetchItems={fetchPlaylists}
      getItemId={getPlaylistId}
      renderItem={renderPlaylistItem}
      isItemLoaded={isItemLoaded}
      emptyItem={
        {
          name: "",
          id: "",
          uri: "",
          tracks: { total: 0 },
        } as SpotifyApi.PlaylistObjectSimplified
      }
    />
  );
}
