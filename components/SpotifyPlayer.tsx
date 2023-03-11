import { ReactElement, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import Script from "next/script";

import { NowPlaying, PlaybackExtraControls, PlayerControls } from "components";
import { Home, Library, Search } from "components/icons";
import {
  useAuth,
  useOnSmallScreen,
  useSpotify,
  useSpotifyPlayer,
  useToast,
  useTranslations,
} from "hooks";
import { DisplayInFullScreen } from "types/spotify";

export default function SpotifyPlayer(): ReactElement {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isPremium = user?.product === "premium";
  const { translations } = useTranslations();
  const router = useRouter();
  const { currentlyPlaying, setDisplayInFullScreen, displayInFullScreen } =
    useSpotify();
  useSpotifyPlayer({ name: "Rindu" });
  const isSmallScreen = useOnSmallScreen();
  const isFullScreenPlayer = displayInFullScreen === DisplayInFullScreen.Player;

  useEffect(() => {
    if (!user?.product) {
      return;
    }

    if (user?.product === "premium") {
      addToast({
        variant: "info",
        message: "Welcome to Rindu, preparing your music for you",
      });
    } else {
      addToast({
        variant: "info",
        message: "Welcome to Rindu, prepare to enjoy!",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.product]);

  return (
    <footer>
      <div className="container">
        {isPremium ? (
          <Script src="https://sdk.scdn.co/spotify-player.js"></Script>
        ) : null}
        <section
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "p") {
              setDisplayInFullScreen(DisplayInFullScreen.Player);
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isSmallScreen) return;
            setDisplayInFullScreen(DisplayInFullScreen.Player);
          }}
        >
          <NowPlaying />
          <div className="playerControls-1">
            <PlayerControls />
          </div>
        </section>
        <section>
          <div className="playerControls-2">
            <PlayerControls />
          </div>
          <nav>
            <Link href="/dashboard" className="dashboard">
              <Home fill="#ffffffb3" />
              {translations?.home}
            </Link>
            <Link href="/search" className="search">
              <Search fill="#ffffffb3" />
              {translations?.search}
            </Link>
            <Link href="/collection" className="collection">
              <Library fill="#ffffffb3" />
              {translations?.collection}
            </Link>
          </nav>
        </section>
        <section>
          <PlaybackExtraControls />
        </section>
      </div>
      <style jsx>{`
        .dashboard,
        .dashboard :global(path) {
          color: ${router.pathname === "/dashboard" ? "#fff" : "inherit"};
          fill: ${router.pathname === "/dashboard" ? "#fff" : "#ffffffb3"};
        }
        .search,
        .search :global(path) {
          color: ${router.pathname === "/search" ? "#fff" : "inherit"};
          fill: ${router.pathname === "/search" ? "#fff" : "#ffffffb3"};
        }
        .library,
        .library :global(path) {
          color: ${router.pathname === "/library" ? "#fff" : "inherit"};
          fill: ${router.pathname === "/library" ? "#fff" : "#ffffffb3"};
        }
        nav :global(a:hover),
        nav :global(a:active),
        nav :global(a:focus) {
          color: #fff;
        }
        nav :global(a:hover path),
        nav :global(a:active path),
        nav :global(a:focus path) {
          fill: #fff;
        }
        footer {
          display: ${isFullScreenPlayer ? "none" : "flex"};
        }
      `}</style>
      <style jsx>{`
        @media (max-width: 1000px) {
          section:nth-child(1) {
            display: ${currentlyPlaying?.id && !isFullScreenPlayer
              ? "flex"
              : "none"};
          }
        }
      `}</style>
      <style jsx>{`
        section {
          display: flex;
        }
        section:nth-child(1) {
          width: 30%;
          min-width: 180px;
          justify-content: flex-start;
        }
        section:nth-child(2),
        .playerControls-2 {
          max-width: 550px;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          display: flex;
          width: 100%;
        }
        section:nth-child(3) {
          width: 30%;
          min-width: 180px;
          justify-content: flex-end;
        }
        div.container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          height: 90px;
          gap: 32px;
        }
        footer {
          width: 100%;
          display: flex;
          flex-direction: column;
          background-color: #181818;
          border-top: 1px solid #282828;
        }
        nav,
        .playerControls-1 {
          display: none;
        }
        nav {
          margin: 8px auto;
        }
        nav :global(a) {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffffb3;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          gap: 4px;
        }
        @media (max-width: 1100px) {
          .playerControls-2 {
            max-width: 350px;
          }
          div.container {
            gap: 0px;
          }
        }
        @media (max-width: 1000px) {
          .playerControls-1 {
            display: flex;
            margin: auto;
            justify-content: flex-end;
          }
          nav {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            max-width: 500px;
            padding: 0 32px;
          }
          .playerControls-1 :global(.progressBar),
          .playerControls-2,
          section:nth-child(3) {
            display: none;
          }
          section:nth-child(1) {
            justify-content: space-between;
            width: 100%;
            padding: 8px 16px;
            border-bottom: 1px solid #282828;
            align-self: baseline;
          }
          div.container {
            height: 150px;
            flex-direction: column;
            gap: 0px;
            padding: 0;
          }
        }
        @media (max-width: 685px) {
          div.container {
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  );
}
