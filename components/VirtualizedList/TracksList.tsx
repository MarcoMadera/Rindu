import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import { IndexRange } from "react-virtualized";

import VirtualizedList from "./VirtualizedList";
import CardTrack, { CardType } from "components/CardTrack";
import DiscSeparator from "components/DiscSeparator";
import { useSpotify } from "hooks";

import { ITrack } from "types/spotify";
import { getIdFromUri, mapPlaylistItems } from "utils";
import {
  checkTracksInLibrary,
  getAlbumTracks,
  getMyLikedSongs,
  getTracksFromPlaylist,
} from "utils/spotifyCalls";

interface Props {
  type: CardType;
  initialTracksInLibrary: boolean[] | null;
  isLibrary?: boolean;
  isGeneratedPlaylist?: boolean;
  album?: SpotifyApi.SingleAlbumResponse;
}
function getTrackPosition(track?: ITrack): number | undefined {
  if (track?.position !== undefined) return track.position;
  if (!track?.id) return undefined;
  return track.track_number !== undefined ? track.track_number - 1 : 0;
}

const getRealIndex = (index: number, separatorIndices: Set<number>) => {
  const separatorsBeforeIndex = Array.from(separatorIndices).filter(
    (sepIndex) => sepIndex < index
  ).length;

  return index - separatorsBeforeIndex;
};

export function TracksList({
  isGeneratedPlaylist,
  isLibrary,
  type,
  initialTracksInLibrary,
  album,
}: Readonly<Props>): ReactElement {
  const { allTracks, pageDetails, setAllTracks } = useSpotify();
  const [tracksInLibrary, setTracksInLibrary] = useState<boolean[] | null>(
    initialTracksInLibrary
  );
  const BATCH_SIZE = 50;
  const [localTracks, setLocalTracks] = useState<ITrack[]>(
    allTracks.slice(0, BATCH_SIZE)
  );
  const isAlbum = type === CardType.Album;

  useEffect(() => {
    setLocalTracks(allTracks.slice(0, BATCH_SIZE));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageDetails?.uri]);

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

  const emptyTrackItem: ITrack = {
    name: "",
    id: "",
    album: { images: [{ url: "" }], name: "", uri: "", type: "track" },
    type: "track",
  };

  const addTracksToPlaylists = useCallback(
    (
      tracks: ITrack[],
      tracksInLibrary: boolean[] | null,
      position: number
    ): void => {
      setAllTracks((allTracks) => spliceTracks(allTracks, tracks, position));
      setLocalTracks((allTracks) => spliceTracks(allTracks, tracks, position));

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

  const getRangeStart = (index: number) =>
    Math.floor(index / BATCH_SIZE) * BATCH_SIZE;
  const [loadedRanges, setLoadedRanges] = useState(() => {
    const initialRanges = new Set<string>();
    const rangeStart = getRangeStart(0);
    initialRanges.add(`${rangeStart}`);
    return initialRanges;
  });

  const addDiscSeparators = (tracks: ITrack[]) => {
    const result: ITrack[] = [];
    let currentDisc: number | undefined;

    tracks.forEach((track) => {
      if (track.disc_number !== currentDisc) {
        currentDisc = track.disc_number;
        result.push({
          ...emptyTrackItem,
          disc_number: currentDisc,
        });
      }
      result.push(track);
    });

    const discs = new Set<number>();
    tracks.forEach((track) => {
      if (track.disc_number) {
        discs.add(track.disc_number);
      }
    });

    if (discs.size < 2) return tracks;

    return result;
  };

  const getSeparatorIndices = (tracks: ITrack[]) => {
    if (!tracks.length) return new Set<number>();

    const separatorIndices = new Set<number>();
    let currentDisc = tracks[0].disc_number;

    separatorIndices.add(0);

    tracks.forEach((track, index) => {
      if (track.disc_number !== currentDisc) {
        separatorIndices.add(index);
        currentDisc = track.disc_number;
      }
    });

    if (separatorIndices.size >= 2) return separatorIndices;

    return new Set<number>();
  };
  const items = isAlbum ? addDiscSeparators(localTracks) : localTracks;
  const separatorIndices = useMemo(
    () => (isAlbum ? getSeparatorIndices(items) : new Set<number>()),
    [isAlbum, items]
  );

  const isIndexLoaded = useCallback(
    (startIndex: number) => {
      const separatorsBeforeIndex = Array.from(separatorIndices).filter(
        (sepIndex) => sepIndex < startIndex
      ).length;

      const adjustedIndex = startIndex - separatorsBeforeIndex;

      const rangeStart = getRangeStart(adjustedIndex);
      const rangeKey = `${rangeStart}`;
      return loadedRanges.has(rangeKey);
    },
    [loadedRanges, separatorIndices]
  );

  const loadMoreRows = useCallback(
    async ({ startIndex }: IndexRange) => {
      const isLoaded = isIndexLoaded(startIndex + 1);
      if (isLoaded) {
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
        : isAlbum
          ? await getAlbumTracks(
              getIdFromUri(pageDetails?.uri, "id") ?? "",
              rangeStart
            )
          : await getTracksFromPlaylist(
              getIdFromUri(pageDetails?.uri, "id") ?? "",
              rangeStart
            );
      const items = data?.items;
      const tracks: ITrack[] | undefined = isAlbum
        ? items
        : mapPlaylistItems(
            items as SpotifyApi.PlaylistTrackObject[],
            startIndex
          );
      if (!tracks) return;
      const trackIds = tracks.map((track) => track.id ?? "");

      const tracksInLibrary = await checkTracksInLibrary(trackIds);

      addTracksToPlaylists(tracks, tracksInLibrary, rangeStart);
    },
    [
      isAlbum,
      addTracksToPlaylists,
      isGeneratedPlaylist,
      isLibrary,
      pageDetails?.uri,
      isIndexLoaded,
    ]
  );

  return (
    <VirtualizedList
      items={items}
      defaultItem={emptyTrackItem}
      totalItems={
        (pageDetails?.tracks?.total ?? localTracks?.length ?? 0) +
        (separatorIndices.size >= 2 ? separatorIndices.size : 0)
      }
      itemHeight={({ index }) =>
        separatorIndices.has(index) && separatorIndices.size >= 2 ? 65 : 65
      }
      loadMoreItems={loadMoreRows}
      isItemLoaded={isItemLoaded}
      renderItem={({ key, style, item: track, index }) => {
        if (separatorIndices.has(index) && separatorIndices.size >= 2) {
          return (
            <DiscSeparator
              key={`disc-${track?.disc_number}`}
              discNumber={track?.disc_number}
              style={style}
            />
          );
        }

        const position = getTrackPosition(track);

        const albumTrack: ITrack = {
          ...track,
          album: {
            images: album?.images ?? [],
            id: album?.id,
            name: album?.name,
            uri: album?.uri,
          },
        };

        const realIndex = getRealIndex(index, separatorIndices);

        return (
          <CardTrack
            key={key}
            style={style}
            track={isAlbum ? albumTrack : track}
            playlistUri={pageDetails?.uri ?? ""}
            isTrackInLibrary={tracksInLibrary?.[position ?? -1]}
            isSingleTrack={isGeneratedPlaylist}
            type={type}
            position={position}
            index={realIndex}
          />
        );
      }}
    />
  );
}
