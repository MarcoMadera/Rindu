import { PropsWithChildren, ReactElement } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { Logo, PlaylistsList, ScrollBar } from "components";
import { Add, Chevron, Heart, Home, Library, Search } from "components/icons";
import { useAnalytics, useAuth, useSpotify, useToast } from "hooks";
import { ITranslations } from "types/translations";
import { chooseImage, templateReplace } from "utils";
import { createPlaylist } from "utils/spotifyCalls";

export default function SideBar({
  width,
  translations,
}: Readonly<
  PropsWithChildren<{ width: number; translations: ITranslations }>
>): ReactElement {
  const {
    setPlaylists,
    playlistPlayingId,
    currentlyPlaying,
    isShowingSideBarImg,
    setIsShowingSideBarImg,
    playedSource,
  } = useSpotify();
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const { trackWithGoogleAnalytics } = useAnalytics();

  const type = playedSource?.split(":")?.[1];
  const id = playedSource?.split(":")?.[2];
  const isCollectionPath = router.pathname.startsWith("/collection");

  return (
    <>
      <nav>
        <Logo color="#fff" />
        <section>
          <Link href="/dashboard" className="dashboard">
            <Home fill="#ffffffb3" />
            {translations.shortCuts.home}
          </Link>
          <Link href="/search" className="search">
            <Search fill="#ffffffb3" />
            {translations.shortCuts.search}
          </Link>
          <Link href="/collection" className="collection">
            <Library fill="#ffffffb3" />
            {translations.sideBar.collection}
          </Link>
        </section>
        <section className="section-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!user?.id) return;
              createPlaylist(user.id)
                .then(async (res) => {
                  if (!res) {
                    addToast({
                      message: templateReplace(
                        translations.toastMessages.errorCreating,
                        [translations.contentType.playlist]
                      ),
                      variant: "error",
                    });
                    return;
                  }
                  setPlaylists((prev) => [res, ...prev]);
                  await router.push(`/playlist/${res.id}`);
                })
                .then(() => {
                  trackWithGoogleAnalytics("event", {
                    eventAction: "createPlaylist",
                    eventCategory: "playlist",
                    eventLabel: "createPlaylist",
                    eventValue: "1",
                  });
                })
                .catch((err) => {
                  const message = "SideBar - createPlaylist";
                  const exDescription =
                    err instanceof Error ? message + err.message : message;
                  trackWithGoogleAnalytics("exception", {
                    exDescription: exDescription,
                    exFatal: "0",
                  });
                });
            }}
          >
            <div>
              <Add />
            </div>
            {translations.sideBar.createPlaylist}
          </button>
          <Link
            href="/collection/tracks"
            className={playlistPlayingId === "tracks" ? "green" : ""}
          >
            <div>
              <Heart active={true} style={{ width: 28, height: 28 }} />
            </div>
            {translations.shortCuts.likedSongs}
          </Link>
          <hr />
        </section>
        <ScrollBar style={{ width: width }}>
          <section className="playlists">
            <PlaylistsList />
          </section>
        </ScrollBar>
        <section
          className={`sidebarImg-container ${
            isShowingSideBarImg ? "animate" : ""
          }`}
        >
          {currentlyPlaying && (
            <>
              <button
                type="button"
                aria-label={translations.sideBar.minimizeCoverImage}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShowingSideBarImg(false);
                }}
                className="show-img"
              >
                <Chevron rotation={"270deg"} />
              </button>
              {playedSource && type && id ? (
                <Link href={`/${type}/${id}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={chooseImage(currentlyPlaying.album?.images, 400).url}
                    alt={currentlyPlaying.album?.name}
                  />
                </Link>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={chooseImage(currentlyPlaying.album?.images, 400).url}
                    alt={currentlyPlaying.album?.name}
                  />
                </>
              )}
            </>
          )}
        </section>
      </nav>
      <style jsx>{`
        section:nth-of-type(1) :global(.dashboard) {
          color: ${router.pathname === "/dashboard" ? "#fff" : "inherit"};
          background: ${router.pathname === "/dashboard" ? "#282828" : "unset"};
        }
        section:nth-of-type(1) :global(.search) {
          color: ${router.pathname === "/search" ? "#fff" : "inherit"};
          background: ${router.pathname === "/search" ? "#282828" : "unset"};
        }
        section:nth-of-type(1) :global(.collection) {
          color: ${isCollectionPath ? "#fff" : "inherit"};
          background: ${isCollectionPath ? "#282828" : "unset"};
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
          color: #ffffffb3;
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
        .section-2 :global(.green) {
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
        section:nth-of-type(1) :global(a) {
          margin-right: 10px;
          display: flex;
          align-items: center;
          padding: 8px 15px;
          border-radius: 4px;
          font-weight: 800;
          color: #ffffffb3;
          font-size: 13px;
        }

        section:nth-of-type(1) :global(a):hover {
          color: #fff;
        }
        section:nth-of-type(1) :global(a:hover svg path) {
          fill: #fff;
        }
        section:nth-of-type(2) {
          padding: 16px 24px;
        }
        section:nth-of-type(2) button,
        section:nth-of-type(2) :global(a) {
          align-items: center;
          display: flex;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          color: #ffffffb3;
          font-weight: 800;
          font-size: 13px;
          margin-bottom: 4px;
          font-family: "Lato";
        }
        section:nth-of-type(2) button:hover,
        section:nth-of-type(2) :global(a):hover {
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
        section:nth-of-type(2) :global(a) div {
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
          background: #ffffffb3;
        }
        section:nth-of-type(2) :global(a) div {
          background: linear-gradient(135deg, #450af5, #c4efd9);
          opacity: 0.7;
        }
        section:nth-of-type(2) :global(a):hover :global(div) {
          opacity: 1;
        }
        section.playlists {
          min-height: 100%;
          padding: 0 8px 20px 24px;
          height: 100%;
        }
        section :global(a) {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          text-decoration: none;
          color: #ffffffb3;
        }
        nav :global(a):hover {
          color: #fff;
        }

        nav :global(.Logo) {
          width: 100%;
          padding: 24px 24px 18px 24px;
        }
      `}</style>
    </>
  );
}
