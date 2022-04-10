import ModalCardTrack from "components/forPlaylistsPage/CardTrack";
import useAuth from "hooks/useAuth";
import useSpotify from "hooks/useSpotify";
import { getTracksFromPlaylist } from "lib/requests";
import { ReactElement, useState } from "react";
import {
  AutoSizer,
  IndexRange,
  InfiniteLoader,
  List,
  WindowScroller,
} from "react-virtualized";
import { AllTracksFromAPlayList, normalTrackTypes } from "types/spotify";
import { ACCESS_TOKEN_COOKIE, __isServer__ } from "utils/constants";
import { takeCookie } from "utils/cookies";
import { checkTracksInLibrary } from "utils/spotifyCalls/checkTracksInLibrary";

export function mapPlaylistItems(
  items: {
    track: SpotifyApi.TrackObjectFull;
    added_at: string;
    is_local: boolean;
  }[],
  startIndex: number
): normalTrackTypes[] {
  return items?.map(({ track, added_at, is_local }, i) => {
    return {
      name: track?.name,
      images: track?.album.images,
      uri: track?.uri,
      href: track?.external_urls.spotify,
      artists: track?.artists,
      id: track?.id,
      explicit: track?.explicit,
      duration: track?.duration_ms,
      audio: track?.preview_url,
      corruptedTrack: !track?.uri,
      position: startIndex + i,
      album: track?.album,
      added_at,
      type: track?.type,
      media_type: "audio",
      is_playable: track?.is_playable,
      is_local,
    };
  });
}

async function getTracksFromLibrary(offSet: number, accessToken?: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/me/tracks?offset=${offSet}&limit=50`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE)
        }`,
      },
    }
  );
  const data = await res.json();
  return data;
}

interface Props {
  type: "playlist" | "album" | "presentation";
  initialTracksInLibrary: boolean[] | null;
  isLibrary?: boolean;
}

export default function Playlist({
  type,
  initialTracksInLibrary,
  isLibrary,
}: Props): ReactElement | null {
  const { allTracks, playlistDetails, setAllTracks } = useSpotify();
  const { accessToken } = useAuth();
  const [tracksInLibrary, setTracksInLibrary] = useState<boolean[] | null>(
    initialTracksInLibrary
  );

  function addTracksToPlaylists(
    tracks: AllTracksFromAPlayList,
    tracksInLibrary: boolean[] | null,
    position: number
  ): void {
    function spliceTracks<T>(allTracks: T[] | null, newTracks: T[]) {
      if (!allTracks) {
        return [...newTracks];
      }
      const tracks = [...allTracks];
      tracks.splice(position, 50, ...newTracks);
      return tracks;
    }

    setAllTracks((allTracks) => spliceTracks(allTracks, tracks));

    if (!tracksInLibrary) return;

    setTracksInLibrary((allTracks) => spliceTracks(allTracks, tracksInLibrary));
  }

  async function loadMoreRows({ startIndex }: IndexRange) {
    const data = isLibrary
      ? await getTracksFromLibrary(startIndex, accessToken)
      : await getTracksFromPlaylist(
          playlistDetails?.id ?? "",
          startIndex,
          accessToken
        );
    const items = data.items;
    const tracks = mapPlaylistItems(items, startIndex);
    const trackIds = tracks.map((track) => track.id ?? "");
    const tracksInLibrary = await checkTracksInLibrary(
      trackIds,
      accessToken || ""
    );
    addTracksToPlaylists(tracks, tracksInLibrary, startIndex);
  }

  return __isServer__ ? (
    <div></div>
  ) : (
    <WindowScroller scrollElement={document.getElementsByClassName("app")[0]}>
      {({ height, isScrolling, onChildScroll, scrollTop }) => {
        return (
          <AutoSizer disableHeight>
            {({ width }) => {
              return (
                <InfiniteLoader
                  isRowLoaded={({ index }) => {
                    return !!allTracks[index]?.name;
                  }}
                  loadMoreRows={loadMoreRows}
                  rowCount={playlistDetails?.tracks.total}
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
                      rowCount={playlistDetails?.tracks.total ?? 0}
                      rowHeight={65}
                      scrollTop={scrollTop}
                      width={width}
                      rowRenderer={({ index, style, key }) => {
                        if (allTracks[index]?.corruptedTrack) {
                          return null;
                        }

                        return (
                          <ModalCardTrack
                            accessToken={accessToken}
                            key={key}
                            style={style}
                            track={allTracks[index]}
                            playlistUri={playlistDetails?.uri ?? ""}
                            isTrackInLibrary={
                              tracksInLibrary?.[
                                allTracks[index]?.position ?? -1
                              ]
                            }
                            type={type}
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
