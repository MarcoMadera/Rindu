import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { normalTrackTypes } from "types/spotify";
import { PlaylistPageHeader } from "../../components/forPlaylistsPage/PlaylistPageHeader";
import useAnalitycs from "../../hooks/useAnalytics";
import useAuth from "hooks/useAuth";
import Head from "next/head";
import useSpotify from "hooks/useSpotify";
import useHeader from "hooks/useHeader";
import { PlayButton } from "../../components/forPlaylistsPage/PlayButton";
import Titles from "components/forPlaylistsPage/Titles";
import List from "layouts/playlist/List";
import { Broom } from "components/icons/Broom";
import RemoveTracksModal from "components/removeTrackModal";
import { ExtraHeader } from "./ExtraHeader";
import { Heart, HeartShape } from "components/icons/Heart";
import { takeCookie } from "utils/cookies";
import { ACCESS_TOKEN_COOKIE } from "utils/constants";
import { PlaylistProps } from "pages/playlist/[playlist]";

async function followPlaylist(id?: string, accessToken?: string) {
  if (!id) {
    return;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/followers`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE)
        }`,
      },
    }
  );
  return res.ok;
}
async function unfollowPlaylist(id?: string, accessToken?: string) {
  if (!id) {
    return;
  }
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${id}/followers`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          accessToken ? accessToken : takeCookie(ACCESS_TOKEN_COOKIE)
        }`,
      },
    }
  );
  return res.ok;
}
async function checkUsersFollowAPlaylist(
  userIds?: string[],
  playlistId?: string,
  accessToken?: string
) {
  if (!playlistId || !userIds) {
    return;
  }
  const ids = userIds.join();
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/followers/contains?ids=${ids}`,
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
  const data = res.json();
  return data;
}

const Playlist: NextPage<PlaylistProps & { isLibrary: boolean }> = ({
  playlistDetails,
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
    setPlaylistDetails,
    setAllTracks,
  } = useSpotify();
  const { headerColor, setElement } = useHeader({ showOnFixed: false });
  const [isPin, setIsPin] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const isMyPlaylist = playlistDetails?.owner.id === user?.id;
  const [isFollowingThisPlaylist, setIsFollowingThisPlaylist] = useState(false);

  const tracks = useMemo(() => playListTracks?.tracks ?? [], [playListTracks]);

  useEffect(() => {
    if (isMyPlaylist) {
      return;
    }
    async function fetchData() {
      const userFollowThisPlaylist = await checkUsersFollowAPlaylist(
        [user?.id ?? ""],
        playlistDetails?.id,
        accessToken
      );
      setIsFollowingThisPlaylist(!!userFollowThisPlaylist?.[0]);
    }
    fetchData();
  }, [accessToken, playlistDetails?.id, user?.id, isMyPlaylist]);

  useEffect(() => {
    if (!playlistDetails) {
      router.push("/");
    }

    setElement(() => <ExtraHeader />);

    setPlaylistDetails(playlistDetails);
    trackWithGoogleAnalitycs();
    setAllTracks(tracks);

    setIsLogin(true);

    setUser(user);
  }, [
    setElement,
    setPlaylistDetails,
    playlistDetails,
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
        if (e?.context.uri === playlistDetails?.uri) {
          setPlaylistPlayingId(playlistDetails?.id);
          return;
        }
      });
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
    const emptyTrackItem: normalTrackTypes = {
      images: [
        {
          url: "",
        },
      ],
      name: "",
      id: "",
      href: "",
      album: { images: [{ url: "" }], name: "", uri: "" },
      media_type: "audio",
      type: "track",
    };

    const restTrackItems = new Array(
      (playlistDetails?.tracks.total ?? tracks.length) - tracks.length
    ).fill(emptyTrackItem);

    setAllTracks([...tracks, ...restTrackItems]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <Head>
        <title>{`Rindu: ${playlistDetails?.name}`}</title>
      </Head>
      <section>
        <PlaylistPageHeader playlistDetails={playlistDetails} />
        <div className="tracksContainer">
          <div className="bg-12"></div>
          <div className="options">
            <PlayButton size={56} centerSize={28} />
            <div className="info">
              <button
                onClick={() => {
                  if (isMyPlaylist) {
                    setOpenModal(true);
                    return;
                  }
                  if (isFollowingThisPlaylist) {
                    unfollowPlaylist(playlistDetails?.id).then((res) => {
                      if (res) {
                        setIsFollowingThisPlaylist(false);
                      }
                    });
                  } else {
                    followPlaylist(playlistDetails?.id).then((res) => {
                      if (res) {
                        setIsFollowingThisPlaylist(true);
                      }
                    });
                  }
                }}
              >
                {isMyPlaylist ? (
                  <Broom width={32} height={32} />
                ) : isFollowingThisPlaylist ? (
                  <Heart width={36} height={36} />
                ) : (
                  <HeartShape fill="#ffffffb3" width={36} height={36} />
                )}
              </button>
            </div>
          </div>
          <div className="trc">
            <Titles isPin={isPin} type="playlist" setIsPin={setIsPin} />
            <List
              type="playlist"
              isLibrary={isLibrary}
              initialTracksInLibrary={tracksInLibrary}
            />
          </div>
        </div>
        {openModal ? (
          <RemoveTracksModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            isLibrary={isLibrary}
          />
        ) : null}
      </section>
      <style jsx>{`
        .info button {
          margin-left: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 56px;
          height: 56px;
          min-width: 56px;
          min-height: 56px;
          background-color: transparent;
          border: none;
        }
        .info button:focus,
        .info button:hover {
          transform: scale(1.06);
        }
        .info button:active {
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
        .options,
        .trc {
          padding: 0 32px;
        }
        .bg-12 {
          background-image: linear-gradient(rgba(0, 0, 0, 0.6) 0, #121212 100%),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
          height: 232px;
          position: absolute;
          width: 100%;
          background-color: ${headerColor ?? "transparent"};
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
