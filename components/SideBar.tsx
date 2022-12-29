import useSpotify from "hooks/useSpotify";
import { ReactElement, useEffect } from "react";
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
import { createPlaylist } from "utils/spotifyCalls/createPlaylist";
import useToast from "hooks/useToast";
import { getCurrentUserPlaylists } from "utils/getAllMyPlaylists";
import PlaylistText from "./PlaylistText";
import useTranslations from "hooks/useTranslations";

export default function SideBar(): ReactElement {
  const {
    playlists,
    setPlaylists,
    playlistPlayingId,
    currentlyPlaying,
    isShowingSideBarImg,
    setIsShowingSideBarImg,
    playedSource,
    showHamburgerMenu,
  } = useSpotify();
  const { accessToken, user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const { translations } = useTranslations();

  useEffect(() => {
    if (!accessToken) return;
    getCurrentUserPlaylists(accessToken).then((res) => {
      if (res) {
        setPlaylists(res.items);
      }
    });
  }, [accessToken, setPlaylists]);

  const type = playedSource?.split(":")?.[1];
  const id = playedSource?.split(":")?.[2];

  return (
    <>
      <nav>
        <div className="logo">
          <Logo color="#fff" />
        </div>
        <section>
          <Link href="/dashboard">
            <a className="dashboard">
              <Home fill="#b3b3b3" />
              {translations?.home}
            </a>
          </Link>
          <Link href="/search">
            <a className="search">
              <Search fill="#b3b3b3" />
              {translations?.search}
            </a>
          </Link>
          <Link href="/collection">
            <a className="collection">
              <Library fill="#b3b3b3" />
              {translations?.collection}
            </a>
          </Link>
        </section>
        <section className="section-2">
          <button
            type="button"
            onClick={() => {
              if (!user?.id) return;
              createPlaylist(user.id, { accessToken }).then((res) => {
                if (!res) {
                  addToast({
                    message: "Error creating playlist",
                    variant: "error",
                  });
                  return;
                }
                setPlaylists((prev) => [res, ...prev]);
                router.push(`/playlist/${res.id}`);
              });
            }}
          >
            <div>
              <Add />
            </div>
            {translations?.createPlaylist}
          </button>
          <Link href="/collection/tracks">
            <a className={playlistPlayingId === "tracks" ? "green" : ""}>
              <div>
                <Heart active={true} style={{ width: 28, height: 28 }} />
              </div>
              {translations?.likedSongs}
            </a>
          </Link>
          <hr />
        </section>
        <section>
          {playlists?.map(({ id, uri, name, type }) => {
            return (
              <PlaylistText
                key={id}
                id={id}
                uri={uri}
                name={name}
                type={type}
              />
            );
          })}
        </section>
        <section
          className={`sidebarImg-container ${
            isShowingSideBarImg ? "animate" : ""
          }`}
        >
          {currentlyPlaying && (
            <>
              <button
                type="button"
                aria-label={translations?.minimizeCoverImage}
                onClick={() => {
                  setIsShowingSideBarImg(false);
                }}
                className="show-img"
              >
                <Chevron rotation={"270deg"} />
              </button>
              {playedSource && type && id ? (
                <Link href={`/${type}/${id}`}>
                  <a>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        currentlyPlaying.album?.images[0]?.url ??
                        currentlyPlaying.album?.images[1]?.url
                      }
                      alt={currentlyPlaying.album?.name}
                    />
                  </a>
                </Link>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      currentlyPlaying.album?.images[0]?.url ??
                      currentlyPlaying.album?.images[1]?.url
                    }
                    alt={currentlyPlaying.album?.name}
                  />
                </>
              )}
            </>
          )}
        </section>
      </nav>
      <style jsx>{`
        section:nth-of-type(1) .dashboard {
          color: ${router.pathname === "/dashboard" ? "#fff" : "inherit"};
          background: ${router.pathname === "/dashboard" ? "#282828" : "unset"};
        }
        section:nth-of-type(1) .search {
          color: ${router.pathname === "/search" ? "#fff" : "inherit"};
          background: ${router.pathname === "/search" ? "#282828" : "unset"};
        }
        section:nth-of-type(1) .library {
          color: ${router.pathname === "/library" ? "#fff" : "inherit"};
          background: ${router.pathname === "/library" ? "#282828" : "unset"};
        }
      `}</style>
      <style jsx>{`
        .sidebarImg-container {
          overflow-y: hidden;
          position: relative;
          display: ${isShowingSideBarImg ? "block" : "none"};
          transform: translateY(-100%);
        }
        .animate {
          animation: scale-in-ver-bottom 0.2s linear both;
        }
        @keyframes scale-in-ver-bottom {
          0% {
            transform: translateY(100%);
            opacity: 0.8;
          }
          100% {
            transform: translateY(4px);
            opacity: 1;
          }
        }

        img {
          width: 100%;
          aspect-ratio: 1;
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
          width: 100%;
          overflow: hidden;
          height: 100%;
          display: grid;
          grid-template-rows: 86px 130px minmax(0, 120px) minmax(0, 1fr) min-content;
        }
        @media (max-width: 1000px) {
          nav {
            display: ${showHamburgerMenu ? "grid" : "none"};
          }
        }
        .section-2 .green {
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
          padding: 0 8px 20px 24px;
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

        .logo {
          width: 100%;
          padding: 24px 24px 18px 24px;
        }
      `}</style>
    </>
  );
}
