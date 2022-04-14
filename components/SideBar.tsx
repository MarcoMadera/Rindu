import useSpotify from "hooks/useSpotify";
import { ReactElement, ReactNode, useEffect } from "react";
import Logo from "./Logo";
import Link from "next/link";
import Home from "./icons/Home";
import Search from "./icons/Search";
import Library from "./icons/Library";
import { useRouter } from "next/router";
import Add from "./icons/Add";
import { Heart } from "./icons/Heart";
import useAuth from "hooks/useAuth";
import { Chevron } from "components/icons/Chevron";

interface SideBarProps {
  children: ReactNode;
}

async function getPlaylist(offset: number, accessToken: string) {
  const res = await fetch(
    `https://api.spotify.com/v1/me/playlists?limit=50&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await res.json();
  return data;
}

async function getAllPlaylists(accessToken: string) {
  const limit = 50;
  const playlistsData: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
    await getPlaylist(0, accessToken);

  let restPlaylistsData:
    | SpotifyApi.ListOfCurrentUsersPlaylistsResponse
    | undefined;
  const max = Math.ceil(playlistsData.total / limit);

  if (max <= 1) {
    return playlistsData;
  }

  for (let i = 1; i < max; i++) {
    const resPlaylistsData = await getPlaylist(limit * i, accessToken);
    if (restPlaylistsData) {
      restPlaylistsData = {
        ...restPlaylistsData,
        items: [...restPlaylistsData.items, ...resPlaylistsData.items],
      };
    } else {
      restPlaylistsData = resPlaylistsData;
    }
  }
  if (!restPlaylistsData) {
    return playlistsData;
  }
  const allPlaylists = {
    ...playlistsData,
    items: [...playlistsData.items, ...restPlaylistsData.items],
  };
  return allPlaylists;
}

export default function SideBar({ children }: SideBarProps): ReactElement {
  const {
    playlists,
    setPlaylists,
    playlistPlayingId,
    currrentlyPlaying,
    isShowingSideBarImg,
    setIsShowingSideBarImg,
    playedSource,
  } = useSpotify();
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) return;

    async function getPlaylists() {
      const allPlaylists: SpotifyApi.ListOfCurrentUsersPlaylistsResponse =
        await getAllPlaylists(accessToken as string);
      setPlaylists(allPlaylists.items);
    }
    getPlaylists();
  }, [accessToken, setPlaylists]);

  const type = playedSource?.split(":")?.[1];
  const id = playedSource?.split(":")?.[2];

  return (
    <>
      <div className="container">
        <nav>
          <div className="logo">
            <Logo color="#fff" />
          </div>
          <section>
            <Link href="/dashboard">
              <a>
                <Home fill="#b3b3b3" />
                Home
              </a>
            </Link>
            <Link href="/search">
              <a>
                <Search fill="#b3b3b3" />
                Search
              </a>
            </Link>
            <Link href="/collection">
              <a>
                <Library fill="#b3b3b3" />
                Your Library
              </a>
            </Link>
          </section>
          <section className="section-2">
            <button>
              <div>
                <Add />
              </div>
              Create Playlist
            </button>
            <Link href="/collection/tracks">
              <a className={playlistPlayingId === "tracks" ? "green" : ""}>
                <div>
                  <Heart fill="#fff" width={13} height={13} />
                </div>
                Liked Songs
              </a>
            </Link>
            <hr />
          </section>
          <section>
            {playlists?.map(({ id, name }) => {
              return (
                <Link key={id} href={`/playlist/${encodeURIComponent(id)}`}>
                  <a
                    className={
                      playlistPlayingId === id ? "playlist green" : "playlist"
                    }
                  >
                    {name}
                  </a>
                </Link>
              );
            })}
          </section>
          <section className="sidebarImg-container">
            {currrentlyPlaying && (
              <>
                <button
                  onClick={() => {
                    setIsShowingSideBarImg(false);
                  }}
                  className="show-img"
                >
                  <Chevron rotation={"270deg"} />
                </button>
                {playedSource ? (
                  <Link href={`/${type}/${id}`}>
                    <a>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          currrentlyPlaying.album.images[2]?.url ??
                          currrentlyPlaying.album.images[1]?.url
                        }
                        alt={currrentlyPlaying.album.name}
                      />
                    </a>
                  </Link>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        currrentlyPlaying.album.images[2]?.url ??
                        currrentlyPlaying.album.images[1]?.url
                      }
                      alt={currrentlyPlaying.album.name}
                    />
                  </>
                )}
              </>
            )}
          </section>
        </nav>
        {children}
        <style jsx>{`
          .sidebarImg-container {
            overflow-y: hidden;
            position: relative;
            align-self: end;
            display: flex;
          }
          img {
            width: 100%;
            aspect-ratio: 1;
            display: ${isShowingSideBarImg ? "block" : "none"};
          }
          .section-2 {
            overflow-y: hidden;
          }
          .sidebarImg-container:hover .show-img {
            opacity: 1;
          }
          .show-img {
            position: absolute;
            opacity: 0;
            top: 5px;
            right: 5px;
            width: 24px;
            height: 24px;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1;
            cursor: auto;
            border: none;
            border-radius: 50%;
            color: #b3b3b3;
          }
          .show-img:hover {
            transform: scale(1.1);
          }
          nav {
            background-color: #010101;
            width: 245px;
            min-width: 245px;
            overflow: hidden;
            height: 100%;
            display: grid;
            grid-template-rows: 86px 130px minmax(0, 120px) minmax(0, 1fr) min-content;
          }
          section:nth-of-type(2) a.green,
          .green {
            color: #1db954;
          }
          section {
            overflow-y: auto;
            overflow-x: hidden;
            width: 100%;
          }
          section:nth-of-type(1) {
            padding: 0 10px;
          }
          section:nth-of-type(1) :global(svg) {
            margin-right: 10px;
          }
          section:nth-of-type(1) a {
            margin-right: 10px;
            display: flex;
            align-items: center;
            padding: 8px 15px;
            border-radius: 4px;
            font-weight: 800;
            color: #b3b3b3;
            font-size: 13px;
          }
          section:nth-of-type(1) a:nth-of-type(1) {
            color: ${router.asPath === "/dashboard" ? "#fff" : "inherit"};
            background: ${router.asPath === "/dashboard" ? "#282828" : "unset"};
          }
          section:nth-of-type(1) a:nth-of-type(2) {
            color: ${router.asPath === "/search" ? "#fff" : "inherit"};
            background: ${router.asPath === "/search" ? "#282828" : "unset"};
          }
          section:nth-of-type(1) a:nth-of-type(3) {
            color: ${router.asPath === "/library" ? "#fff" : "inherit"};
            background: ${router.asPath === "/library" ? "#282828" : "unset"};
          }
          section:nth-of-type(1) a:hover {
            color: #fff;
          }
          section:nth-of-type(1) a:hover :global(svg path) {
            fill: #fff;
          }
          section:nth-of-type(2) {
            padding: 16px 24px;
          }
          section:nth-of-type(2) button,
          section:nth-of-type(2) a {
            align-items: center;
            display: flex;
            width: 100%;
            background: none;
            border: none;
            cursor: pointer;
            color: #b3b3b3;
            font-weight: 800;
            font-size: 13px;
            margin-bottom: 4px;
            font-family: "Lato";
          }
          section:nth-of-type(2) button:hover,
          section:nth-of-type(2) a:hover {
            color: #fff;
          }
          hr {
            margin-top: 15px;
            border: none;
            border-bottom: 0.5pt solid #282828;
          }
          section:nth-of-type(2) button:hover div {
            background: #fff;
          }
          section:nth-of-type(2) button div,
          section:nth-of-type(2) a div {
            align-items: center;
            border-radius: 1px;
            color: #000;
            display: flex;
            flex-shrink: 0;
            height: 24px;
            justify-content: center;
            padding: 4px;
            width: 24px;
            margin: 4px 16px 4px 0px;
          }
          section:nth-of-type(2) button div {
            background: #b3b3b3;
          }
          section:nth-of-type(2) a div {
            background: linear-gradient(135deg, #450af5, #c4efd9);
            opacity: 0.7;
          }
          section:nth-of-type(2) a:hover div {
            opacity: 1;
          }
          section:nth-of-type(3) {
            min-height: 100%;
            padding: 0 24px 20px 24px;
            height: 100%;
          }
          a {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 100%;
            text-decoration: none;
            color: #b3b3b3;
          }
          a:hover {
            color: #fff;
          }
          .playlist {
            font-size: 14px;
          }
          section:nth-of-type(3) a {
            cursor: default;
            margin-bottom: 10px;
          }
          div.container {
            height: calc(100vh - 90px);
            display: flex;
          }
          .logo {
            width: 100%;
            padding: 24px 24px 18px 24px;
          }
        `}</style>
      </div>
    </>
  );
}
