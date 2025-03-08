import { ReactElement, useMemo } from "react";

import { VirtualizedData } from "./VirtualizedData";
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

interface TracksContainerProps {
  type: CardType;
  initialTracksInLibrary?: boolean[] | null;
  isLibrary?: boolean;
  isGeneratedPlaylist?: boolean;
  album?: SpotifyApi.SingleAlbumResponse;
}

export function TracksList({
  type,
  initialTracksInLibrary,
  isLibrary = false,
  isGeneratedPlaylist = false,
  album,
}: TracksContainerProps): ReactElement {
  const { pageDetails, allTracks } = useSpotify();
  const isAlbum = type === CardType.Album;

  const emptyTrackItem: ITrack = useMemo(() => {
    return {
      name: "",
      id: "",
      album: { images: [{ url: "" }], name: "", uri: "", type: "track" },
      type: "track",
    };
  }, []);

  const fetchTracks = async (offset: number) => {
    try {
      let data;

      if (isLibrary) {
        data = await getMyLikedSongs(50, offset);
      } else if (isAlbum) {
        data = await getAlbumTracks(
          getIdFromUri(pageDetails?.uri, "id") ?? "",
          offset
        );
      } else {
        data = await getTracksFromPlaylist(
          getIdFromUri(pageDetails?.uri, "id") ?? "",
          offset
        );
      }

      if (!data?.items) return { items: [], total: 0 };

      const tracks = isAlbum
        ? data.items
        : mapPlaylistItems(
            data.items as SpotifyApi.PlaylistTrackObject[],
            offset
          );

      return {
        items: tracks || [],
        total: data.total || 0,
      };
    } catch (error) {
      console.error("Error loading tracks:", error);
      return { items: [], total: 0 };
    }
  };

  const checkLibraryStatus: (
    trackIds: string[]
  ) => Promise<boolean[] | null> = async (trackIds: string[]) => {
    try {
      return await checkTracksInLibrary(trackIds);
    } catch (error) {
      console.error("Error checking library status:", error);
      return trackIds.map(() => false);
    }
  };

  const getTrackId = (track: ITrack) => track.id || "";

  const transformTracks = useMemo(() => {
    if (!isAlbum) return undefined;

    return (tracks: ITrack[]) => {
      const result: ITrack[] = [];
      let currentDisc: number | undefined;

      tracks.forEach((track) => {
        if (track.disc_number !== currentDisc) {
          currentDisc = track.disc_number;
          if (currentDisc) {
            result.push({
              ...emptyTrackItem,
              disc_number: currentDisc,
            });
          }
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
  }, [isAlbum, emptyTrackItem]);

  const getSeparatorIndices = useMemo(() => {
    if (!isAlbum) return undefined;

    return (tracks: ITrack[]) => {
      if (!tracks.length) return new Set<number>();

      const separatorIndices = new Set<number>();
      let currentDisc = tracks[0].disc_number;

      if (currentDisc) separatorIndices.add(0);

      tracks.forEach((track, index) => {
        if (track.disc_number !== currentDisc) {
          separatorIndices.add(index);
          currentDisc = track.disc_number;
        }
      });

      if (separatorIndices.size >= 2) return separatorIndices;
      return new Set<number>();
    };
  }, [isAlbum]);

  const getTrackPosition = (track?: ITrack): number | undefined => {
    if (track?.position !== undefined) return track.position;
    if (!track?.id) return undefined;
    return track.track_number !== undefined ? track.track_number - 1 : 0;
  };

  const renderTrackItem = ({
    key,
    item: track,
    style,
    index,
    isInLibrary,
  }: {
    key: string;
    item: ITrack;
    style: React.CSSProperties;
    index: number;
    isInLibrary?: boolean;
  }) => {
    if (track.disc_number && !track.id && isAlbum) {
      return (
        <DiscSeparator
          key={`disc-${track.disc_number}`}
          discNumber={track.disc_number}
          style={style}
        />
      );
    }

    const position = getTrackPosition(track);

    const albumTrack: ITrack = isAlbum
      ? {
          ...track,
          album: {
            images: album?.images ?? [],
            id: album?.id,
            name: album?.name,
            uri: album?.uri,
          },
        }
      : track;

    return (
      <CardTrack
        key={key}
        style={style}
        track={albumTrack}
        playlistUri={pageDetails?.uri ?? ""}
        isTrackInLibrary={isInLibrary}
        isSingleTrack={isGeneratedPlaylist}
        type={type}
        position={position}
        index={index}
      />
    );
  };

  const getItemHeight = ({ index }: { index: number }) => {
    const separatorIndices =
      allTracks && getSeparatorIndices
        ? getSeparatorIndices(
            transformTracks ? transformTracks(allTracks) : allTracks
          )
        : new Set<number>();

    return separatorIndices.has(index) && separatorIndices.size >= 2 ? 65 : 65;
  };

  const isItemLoaded = (track?: ITrack) => {
    return !!(
      track &&
      track?.id &&
      track?.name &&
      track?.id !== "" &&
      track?.name !== ""
    );
  };

  return (
    <VirtualizedData
      type="track"
      itemHeight={getItemHeight}
      fetchItems={fetchTracks}
      getItemId={getTrackId}
      renderItem={renderTrackItem}
      isItemLoaded={isItemLoaded}
      initialItems={allTracks}
      initialItemsInLibrary={initialTracksInLibrary}
      checkItemsInLibrary={isGeneratedPlaylist ? undefined : checkLibraryStatus}
      emptyItem={emptyTrackItem}
      transformItems={transformTracks}
      getSeparatorIndices={getSeparatorIndices}
    />
  );
}
