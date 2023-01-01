import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { ITrack } from "types/spotify";
import PageHeader from "../../components/PageHeader";
import useAnalytics from "../../hooks/useAnalytics";
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
import { getSiteUrl } from "utils/environment";
import { PlaylistProps } from "pages/playlist/[playlist]";
import { SearchInputElement } from "components/SearchInputElement";
import { addItemsToPlaylist } from "utils/spotifyCalls/addItemsToPlaylist";
import useToast from "hooks/useToast";
import CardTrack, { CardType } from "components/CardTrack";
import { checkUsersFollowAPlaylist } from "utils/spotifyCalls/checkUsersFollowAPlaylist";
import { followPlaylist } from "utils/spotifyCalls/followPlaylist";
import { unfollowPlaylist } from "utils/spotifyCalls/unfollowPlaylist";
import { HeaderType } from "types/pageHeader";
import ContentContainer from "components/ContentContainer";
import Heading from "components/Heading";
import { createPlaylist } from "utils/spotifyCalls/createPlaylist";
import { addCustomPlaylistImage } from "utils/spotifyCalls/addCustomPlaylistImage";

const Playlist: NextPage<
  PlaylistProps & { isLibrary: boolean; isGeneratedPlaylist?: boolean }
> = ({
  pageDetails,
  playListTracks,
  user,
  tracksInLibrary,
  isLibrary,
  translations,
  isGeneratedPlaylist,
}) => {
  const router = useRouter();
  const { setUser, accessToken } = useAuth();
  const { trackWithGoogleAnalytics } = useAnalytics();
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
    if (!isGeneratedPlaylist) {
      setElement(() => <PlaylistTopBarExtraField uri={pageDetails?.uri} />);
    }
    setPageDetails(pageDetails);
    trackWithGoogleAnalytics();
    setAllTracks(tracks);

    setUser(user);
  }, [
    isGeneratedPlaylist,
    setElement,
    setPageDetails,
    pageDetails,
    trackWithGoogleAnalytics,
    setUser,
    user,
    router,
    setAllTracks,
    tracks,
  ]);

  useEffect(() => {
    if (deviceId && isPlaying && user?.product === "premium") {
      (player as Spotify.Player)
        ?.getCurrentState()
        .then((e) => {
          if (e?.context.uri === pageDetails?.uri) {
            setPlaylistPlayingId(pageDetails?.id);
            return;
          }
        })
        .catch((err) => {
          console.error(err);
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

    const totalTracks = pageDetails?.tracks?.total ?? tracks.length;

    const restTrackItems = new Array(totalTracks - tracks.length).fill(
      emptyTrackItem
    ) as ITrack[];

    setAllTracks([...tracks, ...restTrackItems]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContentContainer hasPageHeader>
      {!isPlaying && (
        <Head>
          <title>{`Rindu: ${pageDetails?.name || ""}`}</title>
        </Head>
      )}
      <PageHeader
        type={
          pageDetails?.type === "concert"
            ? HeaderType.concert
            : pageDetails?.type === "radio"
            ? HeaderType.radio
            : pageDetails?.type === "episode"
            ? HeaderType.episode
            : pageDetails?.type === "podcast"
            ? HeaderType.podcast
            : HeaderType.playlist
        }
        title={pageDetails?.name ?? ""}
        description={pageDetails?.description ?? ""}
        coverImg={
          pageDetails?.images?.[0]?.url ??
          pageDetails?.images?.[1]?.url ??
          `${getSiteUrl()}/defaultSongCover.jpeg`
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
              {isGeneratedPlaylist && (
                <div>
                  <button
                    className="save-concert-to-playlist-button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const playlist = await createPlaylist(user?.id, {
                          name: pageDetails?.name,
                        });
                        if (!playlist) {
                          addToast({
                            message: "Error creating playlist",
                            variant: "error",
                          });
                          return;
                        }
                        await addCustomPlaylistImage(
                          user?.id,
                          playlist.id,
                          accessToken
                        );
                        const uris = allTracks
                          .map((track) => track.uri)
                          .filter((uri) => uri) as string[];
                        await addItemsToPlaylist(playlist.id, uris);
                        addToast({
                          message: "Playlist created",
                          variant: "success",
                        });
                        await router.push(`/playlist/${playlist.id}`);
                      } catch (e) {
                        console.error(e);
                        addToast({
                          message: "Error creating playlist",
                          variant: "error",
                        });
                      }
                    }}
                  >
                    {translations.saveAsPlaylist}
                  </button>
                </div>
              )}
              {!isGeneratedPlaylist && (
                <>
                  <PlayButton
                    uri={pageDetails?.uri}
                    size={56}
                    centerSize={28}
                    allTracks={allTracks}
                  />
                  <div className="info">
                    {isMyPlaylist ? (
                      <button
                        type="button"
                        aria-label={translations?.cleanPlaylist}
                        className="broom"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenModal(true);
                        }}
                      >
                        <Broom width={32} height={32} />
                      </button>
                    ) : (
                      <Heart
                        active={isFollowingThisPlaylist}
                        handleLike={async () => {
                          const followRes = await followPlaylist(
                            pageDetails?.id
                          );
                          if (followRes) {
                            setIsFollowingThisPlaylist(true);
                            addToast({
                              variant: "success",
                              message: translations.playlistAddedToLibrary,
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
                              message: translations.playlistRemovedFromLibrary,
                            });
                            return true;
                          }
                          return null;
                        }}
                        style={{ width: 80, height: 80 }}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="trc">
              <TrackListHeader
                isPin={isPin}
                type={CardType.playlist}
                setIsPin={setIsPin}
              />
              <VirtualizedList
                type={CardType.playlist}
                isLibrary={isLibrary}
                isGeneratedPlaylist={isGeneratedPlaylist}
                initialTracksInLibrary={tracksInLibrary}
              />
            </div>
          </>
        ) : null}
        {!isGeneratedPlaylist &&
        playListTracks &&
        playListTracks.length === 0 ? (
          <div className="noTracks">
            <Heading number={3} as="h2" margin="1rem 0">
              {translations.playlistSearchHeading}
            </Heading>
            <SearchInputElement setData={setSearchedData} source="playlist" />
            {searchedData?.tracks && searchedData.tracks?.items?.length > 0 && (
              <>
                <Heading number={4} margin="20px 0 0 0">
                  {translations.songs}
                </Heading>
                {searchedData.tracks?.items?.map((track, i) => {
                  return (
                    <CardTrack
                      accessToken={accessToken ?? ""}
                      isTrackInLibrary={tracksInLibrary?.[i] ?? false}
                      playlistUri=""
                      track={track}
                      allTracks={allTracks}
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
                      type={CardType.presentation}
                      position={i}
                      isSingleTrack
                      uri={track.uri}
                    />
                  );
                })}
              </>
            )}
            {searchedData?.episodes &&
              searchedData.episodes?.items?.length > 0 && (
                <>
                  <Heading number={4} margin="20px 0 0 0">
                    Episodes
                  </Heading>
                  {searchedData.episodes.items?.map((track, i) => {
                    return (
                      <CardTrack
                        allTracks={allTracks}
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
                        type={CardType.presentation}
                        position={i}
                        isSingleTrack
                        uri={track.uri}
                      />
                    );
                  })}
                </>
              )}
          </div>
        ) : isGeneratedPlaylist &&
          playListTracks &&
          playListTracks.length === 0 ? (
          <div className="noTracks">
            <Heading number={3} as="h2" margin="1rem 0">
              {translations.noTracksFoundForConcert}
            </Heading>
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
        .save-concert-to-playlist-button {
          border-radius: 500px;
          text-decoration: none;
          color: #fff;
          cursor: pointer;
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.76px;
          line-height: 18px;
          padding: 12px 34px;
          text-align: center;
          text-transform: uppercase;
          transition: all 33ms cubic-bezier(0.3, 0, 0, 1);
          white-space: nowrap;
          background-color: #000000;
          border: 1px solid #ffffffb3;
          will-change: transform;
        }
        .save-concert-to-playlist-button:focus,
        .save-concert-to-playlist-button:hover {
          transform: scale(1.06);
          background-color: #000;
          border: 1px solid #fff;
        }
        .save-concert-to-playlist-button:active {
          transform: scale(1);
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
          grid-template-columns: [index] 48px [first] 6fr [var1] 4fr [var2] 3fr [popularity] 1fr [last] minmax(
              160px,
              1fr
            );
        }
        .trc :global(.titles span) {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: #ffffffb3;
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
        @media (max-width: 768px) {
          .options {
            margin: 32px 0;
          }
        }
      `}</style>
    </ContentContainer>
  );
};

export default Playlist;
