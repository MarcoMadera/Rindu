import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  AllTracksFromAPlaylistResponse,
  normalTrackTypes,
  SpotifyUserResponse,
} from "types/spotify";
import { PlaylistPageHeader } from "../../components/forPlaylistsPage/PlaylistPageHeader";
import useAnalitycs from "../../hooks/useAnalytics";
import useAuth from "hooks/useAuth";
import Head from "next/head";
import useSpotify from "hooks/useSpotify";
import useHeader from "hooks/useHeader";
import { PlayButton } from "../../components/forPlaylistsPage/PlayButton";
import Titles from "components/forPlaylistsPage/Titles";
import List from "layouts/playlist/List";
import { Flask } from "components/icons/Flask";
import RemoveTracksModal from "components/removeTrackModal";
import { ExtraHeader } from "./ExtraHeader";
import { Heart, HeartShape } from "components/icons/Heart";
import { takeCookie } from "utils/cookies";
import { ACCESSTOKENCOOKIE } from "utils/constants";

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
          accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE)
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
          accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE)
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
          accessToken ? accessToken : takeCookie(ACCESSTOKENCOOKIE)
        }`,
      },
    }
  );
  const data = res.json();
  return data;
}

interface PlaylistProps {
  playlistDetails: SpotifyApi.SinglePlaylistResponse;
  playListTracks: AllTracksFromAPlaylistResponse;
  tracksInLibrary: boolean[];
  accessToken?: string;
  user: SpotifyUserResponse | null;
  type: "saved" | "playlist";
}

const Playlist: NextPage<PlaylistProps> = ({
  playlistDetails,
  playListTracks,
  user,
  tracksInLibrary,
  type,
}) => {
  const { tracks } = playListTracks;
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
  const { setElement } = useHeader({ showOnFixed: false });
  const [isPin, setIsPin] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const isMyPlaylist = playlistDetails.owner.id === user?.id;
  const [isFollowingThisPlaylist, setIsFollowingThisPlaylist] = useState(false);

  useEffect(() => {
    if (isMyPlaylist) {
      return;
    }
    async function fetchData() {
      const userFollowThisPlaylist = await checkUsersFollowAPlaylist(
        [user?.id ?? ""],
        playlistDetails.id,
        accessToken
      );
      setIsFollowingThisPlaylist(!!userFollowThisPlaylist?.[0]);
    }
    fetchData();
  }, [accessToken, playlistDetails.id, user?.id, isMyPlaylist]);

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
      playlistDetails.tracks.total - tracks.length
    ).fill(emptyTrackItem);

    setAllTracks([...tracks, ...restTrackItems]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <Head>
        <title>{`Rindu: ${playlistDetails.name}`}</title>
      </Head>
      <section>
        <PlaylistPageHeader playlistDetails={playlistDetails} />
        <div className="tracksContainer">
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
                    unfollowPlaylist(playlistDetails.id).then((res) => {
                      if (res) {
                        setIsFollowingThisPlaylist(false);
                      }
                    });
                  } else {
                    followPlaylist(playlistDetails.id).then((res) => {
                      if (res) {
                        setIsFollowingThisPlaylist(true);
                      }
                    });
                  }
                }}
              >
                {isMyPlaylist ? (
                  <Flask width={32} height={32} />
                ) : isFollowingThisPlaylist ? (
                  <Heart width={36} height={36} />
                ) : (
                  <HeartShape fill="#ffffffb3" width={36} height={36} />
                )}
              </button>
            </div>
          </div>
          <div className="trc">
            <Titles setIsPin={setIsPin} />
            <List type={type} initialTracksInLibrary={tracksInLibrary} />
          </div>
        </div>
        {openModal ? (
          <RemoveTracksModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            type={type}
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
