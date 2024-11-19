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

  const isItemLoaded = useCallback(
    (index: number) => {
      return !!allTracks?.[index]?.name;
    },
    [allTracks]
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
