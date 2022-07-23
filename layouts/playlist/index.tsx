import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { ITrack } from "types/spotify";
import PageHeader from "../../components/PageHeader";
import useAnalitycs from "../../hooks/useAnalytics";
import useAuth from "hooks/useAuth";
import Head from "next/head";
import useSpotify from "hooks/useSpotify";
import useHeader from "hooks/useHeader";
import { PlayButton } from "../../components/PlayButton";
import TrackListHeader from "components/TrackListHeader";
import VirtualizedList from "components/VirtualizedList";
import { Broom } from "components/icons/Broom";
import RemoveTracksModal from "components/RemoveTracksModal";
import PlaylistTopBarExtraField from "../../components/PlaylistTopBarExtraField";
import { Heart } from "components/icons/Heart";
import { SITE_URL } from "utils/constants";
import { PlaylistProps } from "pages/playlist/[playlist]";
import { SearchInputElement } from "components/SearchInputElement";
import { addItemsToPlaylist } from "utils/spotifyCalls/addItemsToPlaylist";
import useToast from "hooks/useToast";
import CardTrack from "components/CardTrack";
import { checkUsersFollowAPlaylist } from "utils/spotifyCalls/checkUsersFollowAPlaylist";
import { followPlaylist } from "utils/spotifyCalls/followPlaylist";
import { unfollowPlaylist } from "utils/spotifyCalls/unfollowPlaylist";
import { HeaderType } from "types/pageHeader";
import ContentContainer from "components/ContentContainer";

const Playlist: NextPage<PlaylistProps & { isLibrary: boolean }> = ({
  pageDetails,
  playListTracks,
  user,
  tracksInLibrary,
  isLibrary,
}) => {
  const router = useRouter();
  const { setIsLogin, setUser, accessToken } = useAuth();
  const { trackWithGoogleAnalitycs } = useAnalitycs();
  const {
    player,
    isPlaying,
    deviceId,
    setPlaylistPlayingId,
    setPageDetails,
    setAllTracks,
    allTracks,
  } = useSpotify();
  const { setElement } = useHeader();
  const [isPin, setIsPin] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const isMyPlaylist = pageDetails?.owner?.id === user?.id;
  const [isFollowingThisPlaylist, setIsFollowingThisPlaylist] = useState(false);
  const [searchedData, setSearchedData] =
    useState<SpotifyApi.SearchResponse | null>(null);
  const { addToast } = useToast();

  const tracks = useMemo(() => playListTracks ?? [], [playListTracks]);

  useEffect(() => {
    if (isMyPlaylist) {
      return;
    }
    async function fetchData() {
      const userFollowThisPlaylist = await checkUsersFollowAPlaylist(
        [user?.id ?? ""],
        pageDetails?.id,
        accessToken
      );
      setIsFollowingThisPlaylist(!!userFollowThisPlaylist?.[0]);
    }
    fetchData();
  }, [accessToken, pageDetails?.id, user?.id, isMyPlaylist]);

  useEffect(() => {
    if (!pageDetails) {
      router.push("/");
    }

    setElement(() => <PlaylistTopBarExtraField uri={pageDetails?.uri} />);

    setPageDetails(pageDetails);
    trackWithGoogleAnalitycs();
    setAllTracks(tracks);

    setIsLogin(true);

    setUser(user);
  }, [
    setElement,
    setPageDetails,
    pageDetails,
    trackWithGoogleAnalitycs,
    setIsLogin,
    setUser,
    user,
    router,
    setAllTracks,
    tracks,
  ]);

  useEffect(() => {
    if (deviceId && isPlaying && user?.product === "premium") {
      (player as Spotify.Player)?.getCurrentState().then((e) => {
        if (e?.context.uri === pageDetails?.uri) {
          setPlaylistPlayingId(pageDetails?.id);
          return;
        }
      });
    }
  }, [
    isPlaying,
    deviceId,
    player,
    pageDetails,
    setPlaylistPlayingId,
    user?.product,
  ]);

  useEffect(() => {
    const emptyTrackItem: ITrack = {
      name: "",
      id: "",
      album: { images: [{ url: "" }], name: "", uri: "", type: "track" },
      type: "track",
    };

    const restTrackItems = new Array(
      (pageDetails?.tracks?.total ?? tracks.length) - tracks.length
    ).fill(emptyTrackItem);

    setAllTracks([...tracks, ...restTrackItems]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContentContainer hasPageHeader>
      {!isPlaying && (
        <Head>
          <title>{`Rindu: ${pageDetails?.name}`}</title>
        </Head>
      )}
      <PageHeader
        type={HeaderType.playlist}
        title={pageDetails?.name ?? ""}
        description={pageDetails?.description ?? ""}
        coverImg={
          pageDetails?.images?.[0]?.url ??
          pageDetails?.images?.[1]?.url ??
          `${SITE_URL}/defaultSongCover.jpeg`
        }
        ownerDisplayName={pageDetails?.owner?.display_name ?? ""}
        ownerId={pageDetails?.owner?.id ?? ""}
        totalFollowers={pageDetails?.followers?.total ?? 0}
        totalTracks={pageDetails?.tracks?.total ?? 0}
      />
      <div className="tracksContainer">
        {allTracks.length > 0 ? (
          <>
            <div className="options">
              <PlayButton uri={pageDetails?.uri} size={56} centerSize={28} />
              <div className="info">
                {isMyPlaylist ? (
                  <button
                    type="button"
                    aria-label="Clean playlist"
                    className="broom"
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    <Broom width={32} height={32} />
                  </button>
                ) : (
                  <Heart
                    active={isFollowingThisPlaylist}
                    handleLike={async () => {
                      const followRes = await followPlaylist(pageDetails?.id);
                      if (followRes) {
                        setIsFollowingThisPlaylist(true);
                        addToast({
                          variant: "success",
                          message: "Playlist added to your library",
                        });
                        return true;
                      }
                      return null;
                    }}
                    handleDislike={async () => {
                      const unfollowRes = await unfollowPlaylist(
                        pageDetails?.id
                      );
                      if (unfollowRes) {
                        setIsFollowingThisPlaylist(false);
                        addToast({
                          variant: "success",
                          message: "Playlist removed from your library",
                        });
                        return true;
                      }
                      return null;
                    }}
                    style={{ width: 80, height: 80 }}
                  />
                )}
              </div>
            </div>
            <div className="trc">
              <TrackListHeader
                isPin={isPin}
                type="playlist"
                setIsPin={setIsPin}
              />
              <VirtualizedList
                type="playlist"
                isLibrary={isLibrary}
                initialTracksInLibrary={tracksInLibrary}
              />
            </div>
          </>
        ) : null}
        {playListTracks && playListTracks?.length === 0 ? (
          <div className="noTracks">
            <h3>Let&apos;s find something for your playlist</h3>
            <SearchInputElement setData={setSearchedData} source="playlist" />
            {searchedData?.tracks && searchedData.tracks.items.length > 0 && (
              <>
                <h5>Songs</h5>
                {searchedData.tracks?.items?.map((track, i) => {
                  return (
                    <CardTrack
                      accessToken={accessToken ?? ""}
                      isTrackInLibrary={tracksInLibrary?.[i] ?? false}
                      playlistUri=""
                      track={track}
                      onClickAdd={() => {
                        if (!pageDetails?.id) return;
                        addItemsToPlaylist(pageDetails.id, [track.uri]).then(
                          (res) => {
                            if (res?.snapshot_id) {
                              setAllTracks((prev) => {
                                return [
                                  ...prev,
                                  {
                                    ...track,
                                    position: prev.length,
                                    images: track.album.images,
                                    duration: track.duration_ms,
                                    added_at: Date.now(),
                                  },
                                ];
                              });
                            }
                          }
                        );
                      }}
                      key={track.id}
                      type="presentation"
                      position={i}
                      isSingleTrack
                      uri={track.uri}
                    />
                  );
                })}
              </>
            )}
            {searchedData?.episodes && searchedData.episodes.items.length > 0 && (
              <>
                <h5>Episodes</h5>
                {searchedData.episodes?.items?.map((track, i) => {
                  return (
                    <CardTrack
                      accessToken={accessToken ?? ""}
                      isTrackInLibrary={tracksInLibrary?.[i] ?? false}
                      playlistUri=""
                      track={track}
                      onClickAdd={() => {
                        if (!pageDetails?.id) return;
                        addItemsToPlaylist(pageDetails.id, [track.uri]).then(
                          (res) => {
                            if (res?.snapshot_id) {
                              setAllTracks((prev) => {
                                return [
                                  ...prev,
                                  {
                                    ...track,
                                    position: prev.length,
                                    images: track.images,
                                    duration: track.duration_ms,
                                    added_at: Date.now(),
                                    album: {
                                      images: track.images,
                                      name: track.name,
                                      uri: track.uri,
                                      id: track.id,
                                      type: "episode",
                                    },
                                  },
                                ];
                              });
                            }
                          }
                        );
                      }}
                      key={track.id}
                      type="presentation"
                      position={i}
                      isSingleTrack
                      uri={track.uri}
                    />
                  );
                })}
              </>
            )}
          </div>
        ) : null}
      </div>
      {openModal ? (
        <RemoveTracksModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          isLibrary={isLibrary}
        />
      ) : null}
      <style jsx>{`
        h3,
        h5 {
          color: #fff;
          display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.75rem;
          text-transform: none;
          margin: 0;
          z-index: 1;
          position: relative;
          margin: 16px 0;
        }
        h3 {
          font-size: 1.5rem;
        }
        h5 {
          margin-top: 20px;
          font-size: 1.1rem;
        }
        .info :global(button) {
          margin-left: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          border: none;
        }
        .info button.broom {
          margin-left: 28px;
        }
        .info button.broom:hover,
        .info button.broom:focus {
          transform: scale(1.1);
        }
        .info button.broom:active {
          transform: scale(1);
        }
        .options {
          display: flex;
          padding: 24px 0;
          position: relative;
          width: 100%;
          align-items: center;
          margin: 16px 0;
          flex-direction: row;
        }
        .tracksContainer {
          padding: 0 32px;
        }
        .trc {
          margin-bottom: 50px;
        }
        .noTracks {
          z-index: 2;
          position: relative;
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
              160px,
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
      `}</style>
    </ContentContainer>
  );
};

export default Playlist;
