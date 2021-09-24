import { NextApiRequest, NextApiResponse, NextPage } from "next";
import {
  getSinglePlayListRequest,
  getTracksFromPlaylist,
  getTracksFromPlayListRequest,
  refreshAccessTokenRequest,
} from "../../lib/requests";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ModalCardTrack from "../../components/forPlaylistsPage/CardTrack";
import {
  AllTracksFromAPlayList,
  AllTracksFromAPlaylistResponse,
  SpotifyUserResponse,
} from "types/spotify";
import { PlaylistPageHeader } from "../../components/forPlaylistsPage/PlaylistPageHeader";
import {
  ACCESSTOKENCOOKIE,
  REFRESHTOKENCOOKIE,
  __isServer__,
} from "../../utils/constants";
import { takeCookie } from "../../utils/cookies";
import { validateAccessToken } from "../../utils/validateAccessToken";
import Router from "next/router";
import useAnalitycs from "../../hooks/useAnalytics";
import useAuth from "hooks/useAuth";
import { findDuplicateSongs } from "utils/findDuplicateSongs";
import Head from "next/head";
import useSpotify from "hooks/useSpotify";
import useHeader from "hooks/useHeader";
import { PlayButton } from "../../components/forPlaylistsPage/PlayButton";
import { checkTracksInLibrary } from "lib/spotify";
import Titles from "components/forPlaylistsPage/Titles";
import List from "react-virtualized/dist/commonjs/List";
import {
  IndexRange,
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
} from "react-virtualized";

interface PlaylistProps {
  playlistDetails: SpotifyApi.SinglePlaylistResponse;
  playListTracks: AllTracksFromAPlaylistResponse;
  accessToken?: string;
  user: SpotifyUserResponse | null;
}

const Playlist: NextPage<PlaylistProps> = ({
  playlistDetails,
  playListTracks,
  accessToken,
  user,
}) => {
  const { tracks } = playListTracks;
  const router = useRouter();
  const [duplicatesSongs, setDuplicatesSongs] = useState<number[]>([]);
  const [corruptedSongs, setCorruptedSongs] = useState<number>(0);
  const [tracksInLibrary, setTracksInLibrary] = useState<boolean[]>([]);
  const { setIsLogin, setUser } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const {
    player,
    isPlaying,
    deviceId,
    setPlaylistPlayingId,
    setPlaylistDetails,
    setAllTracks,
    allTracks,
  } = useSpotify();
  const { setElement } = useHeader();
  const [isPin, setIsPin] = useState(false);

  useEffect(() => {
    if (!playlistDetails) {
      router.push("/");
    }
    setElement(() => (
      <div>
        <PlayButton size={40} centerSize={16} />
        <span>{playlistDetails.name}</span>
        <style jsx>{`
          span {
            color: #fff;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.04em;
            line-height: 28px;
            overflow: hidden;
            padding: 0 16px;
            text-overflow: ellipsis;
            pointer-events: none;
          }
          div {
            align-items: center;
            display: flex;
            white-space: nowrap;
          }
        `}</style>
      </div>
    ));
    setPlaylistDetails(playlistDetails);
    trackWithGoogleAnalitycs();
    setAllTracks(tracks);

    setIsLogin(true);

    setUser(user);

    return () => setElement(null);
  }, [
    setElement,
    setPlaylistDetails,
    playlistDetails,
    trackWithGoogleAnalitycs,
    tracks,
    setIsLogin,
    setUser,
    user,
    router,
    setAllTracks,
  ]);

  useEffect(() => {
    if (deviceId && isPlaying && user?.product === "premium") {
      (player as Spotify.Player)?.getCurrentState().then((e) => {
        if (e?.context.uri === playlistDetails.uri) {
          setPlaylistPlayingId(playlistDetails.id);
          return;
        }
      });
      setPlaylistPlayingId(undefined);
    }
  }, [
    isPlaying,
    deviceId,
    player,
    playlistDetails,
    setPlaylistPlayingId,
    user?.product,
  ]);

  useEffect(() => {
    if (!(tracks?.length > 0)) {
      return;
    }

    setDuplicatesSongs(findDuplicateSongs(tracks));

    setCorruptedSongs(() => {
      const corrupted = tracks.filter(({ corruptedTrack }) => corruptedTrack);
      return corrupted.length;
    });
  }, [tracks]);

  useEffect(() => {
    if (!tracks) {
      return;
    }
    const trackIds = tracks.map(({ id }) => id ?? "");
    async function fetchData() {
      const tracksInLibrary = await checkTracksInLibrary(
        trackIds,
        accessToken || ""
      );
      setTracksInLibrary(tracksInLibrary);
    }
    fetchData();
  }, [tracks, accessToken]);

  function addTracksToPlaylists(
    tracks: AllTracksFromAPlayList,
    position: number
  ): void {
    setAllTracks((allTracks) => {
      const newTracks = [...allTracks];
      newTracks.splice(position, 100, ...tracks);
      return newTracks;
    });
  }

  async function loadMoreRows({ startIndex }: IndexRange) {
    const res = await getTracksFromPlaylist(playlistDetails.id, startIndex);
    const data = await res.json();
    const items = data.items;
    const tracks = items?.map(
      (
        {
          track,
          added_at,
          is_local,
        }: {
          track: SpotifyApi.TrackObjectFull;
          added_at: string;
          is_local: boolean;
        },
        i: number
      ) => {
        return {
          name: track?.name,
          images: track?.album.images,
          uri: track?.uri,
          href: track?.external_urls.spotify,
          artists: track.artists,
          id: track?.id,
          explicit: track?.explicit,
          duration: track?.duration_ms,
          audio: track?.preview_url,
          corruptedTrack: !track?.uri,
          position: startIndex + i,
          album: track.album,
          added_at,
          type: track.type,
          media_type: "audio",
          is_playable: track.is_playable,
          is_local,
        };
      }
    );
    addTracksToPlaylists(tracks, startIndex);
  }

  return (
    <main>
      <Head>
        <title>{`Rindu: ${playlistDetails.name}`}</title>
      </Head>
      <section>
        <PlaylistPageHeader
          playlistDetails={playlistDetails}
          duplicatesSongs={duplicatesSongs}
          corruptedSongs={corruptedSongs}
          setAllTracks={setAllTracks}
        />
        <div className="tracksContainer">
          <div className="options">
            <PlayButton size={56} centerSize={28} />
          </div>
          <div className="trc">
            <Titles setIsPin={setIsPin} />

            <WindowScroller
              scrollElement={
                __isServer__
                  ? undefined
                  : document.getElementsByClassName("app")[0]
              }
            >
              {({ height, isScrolling, onChildScroll, scrollTop }) => {
                return (
                  <AutoSizer disableHeight>
                    {({ width }) => {
                      return (
                        <InfiniteLoader
                          isRowLoaded={({ index }) => {
                            return !!allTracks[index];
                          }}
                          loadMoreRows={loadMoreRows}
                          rowCount={playlistDetails.tracks.total}
                        >
                          {({ onRowsRendered, registerChild }) => (
                            <div ref={registerChild}>
                              <List
                                autoHeight
                                height={height}
                                isScrolling={isScrolling}
                                onRowsRendered={onRowsRendered}
                                onScroll={onChildScroll}
                                overscanRowCount={2}
                                rowCount={playlistDetails.tracks.total}
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
                                      playlistUri={playlistDetails.uri}
                                      isTrackInLibrary={
                                        tracksInLibrary[
                                          allTracks[index]?.position ?? -1
                                        ]
                                      }
                                    />
                                  );
                                }}
                              />
                            </div>
                          )}
                        </InfiniteLoader>
                      );
                    }}
                  </AutoSizer>
                );
              }}
            </WindowScroller>

            {/* {allTracks?.length > 0
              ? allTracks?.map((track, i) => {
                  if (track.corruptedTrack) {
                    return null;
                  }
                  return (
                    <ModalCardTrack
                      accessToken={accessToken}
                      key={track.position || i}
                      track={track}
                      playlistUri={playlistDetails.uri}
                      isTrackInLibrary={tracksInLibrary[track.position ?? -1]}
                      offSet={i}
                      addTracksToPlaylists={addTracksToPlaylists}
                    />
                  );
                })
              : null} */}
          </div>
        </div>
      </section>

      <style jsx>{`
        .options {
          display: flex;
          padding: 24px 0;
          position: relative;
          width: 100%;
          align-items: center;
          flex-direction: row;
        }
        .trc {
          margin-bottom: 50px;
        }
        .trc :global(.titles) {
          border-bottom: 1px solid transparent;
          box-sizing: content-box;
          height: 36px;
          margin: ${isPin ? "0 -32px 8px" : "0 -16px 8px"};
          padding: ${isPin ? "0 32px" : "0 16px"};
          position: sticky;
          top: 60px;
          z-index: 2;
          display: grid;
          grid-gap: 16px;
          background-color: ${isPin ? "#181818" : "transparent"};
          border-bottom: 1px solid #ffffff1a;
          grid-template-columns: [index] 48px [first] 6fr [var1] 4fr [var2] 3fr [last] minmax(
              120px,
              1fr
            );
        }
        .trc :global(.titles span) {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: #b3b3b3;
          font-family: sans-serif;
        }
        .trc :global(.titles span:nth-of-type(1)) {
          font-size: 16px;
          justify-self: center;
          margin-left: 16px;
        }
        .trc :global(.titles span:nth-of-type(2)) {
          margin-left: 70px;
        }
        .trc :global(.titles span:nth-of-type(5)) {
          justify-content: center;
        }
        main {
          display: block;
          margin: -60px auto 0 auto;
          height: calc(100vh - 90px);
          width: calc(100vw - 245px);
        }
        .tracksContainer {
          padding: 0 32px;
        }
        section {
          display: flex;
          flex-direction: column;
          margin: 0 auto;
          padding: 0;
        }
      `}</style>
    </main>
  );
};

export default Playlist;

export async function getServerSideProps({
  params: { playlist },
  req,
  res,
}: {
  params: { playlist: string };
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  props: {
    playlistDetails: PlaylistProps;
    user?: SpotifyUserResponse | null;
    playListTracks: AllTracksFromAPlaylistResponse;
    accessToken?: string;
  };
}> {
  const cookies = req ? req?.headers?.cookie : undefined;
  const refreshToken = takeCookie(REFRESHTOKENCOOKIE, cookies);
  let accessToken = takeCookie(ACCESSTOKENCOOKIE, cookies);
  const user = await validateAccessToken(accessToken);

  try {
    if (refreshToken && !user) {
      const re = await refreshAccessTokenRequest(refreshToken);
      if (!re.ok) {
        res.writeHead(307, { Location: "/" });
        res.end();
      }
      const refresh = await re.json();
      accessToken = refresh.accessToken;
    } else {
      accessToken = cookies
        ? takeCookie(ACCESSTOKENCOOKIE, cookies)
        : undefined;
    }

    if (!cookies) {
      res.writeHead(307, { Location: "/" });
      res.end();
    }
  } catch (error) {
    console.log(error);
  }

  const _res = await getSinglePlayListRequest(playlist, cookies);
  const playlistDetails = await _res.json();
  const playListTracksres = await getTracksFromPlayListRequest(
    playlist,
    cookies
  );

  if (!user) {
    if (res) {
      res.writeHead(307, { Location: "/" });
      res.end();
    } else {
      Router.replace("/");
    }
  }

  const playListTracks = await playListTracksres.json();
  return {
    props: { playlistDetails, playListTracks, accessToken, user },
  };
}
