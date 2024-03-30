import { PropsWithChildren, ReactElement, useEffect, useRef } from "react";

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
} from "hooks";
import { AppContainer } from "layouts/AppContainer";
import FullScreenPlayer from "layouts/FullScreenPlayer";
import { DisplayInFullScreen } from "types/spotify";
import { ITranslations } from "types/translations";
import {
  exitFullScreen,
  isFullScreen,
  isServer,
  requestFullScreen,
} from "utils";

export default function SpotifyPlayer({
  translations,
}: PropsWithChildren<{ translations: ITranslations }>): ReactElement {
  const { user, isPremium } = useAuth();
  const { addToast } = useToast();
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

    if (isPremium) {
      addToast({
        variant: "info",
        message: translations.toastMessages.welcomePreparing,
      });
    } else {
      addToast({
        variant: "info",
        message: translations.toastMessages.welcomeReady,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.product, isPremium]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleFullScreenChange() {
      if (!isFullScreen()) {
        setDisplayInFullScreen(DisplayInFullScreen.App);
      }
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullScreenChange,
      false
    );
    document.addEventListener(
      "mozfullscreenchange",
      handleFullScreenChange,
      false
    );
    document.addEventListener(
      "fullscreenchange",
      handleFullScreenChange,
      false
    );
    document.addEventListener(
      "MSFullscreenChange",
      handleFullScreenChange,
      false
    );

    if (!ref.current) return;

    if (isFullScreenPlayer) {
      requestFullScreen(ref.current);
    }

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange,
        false
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullScreenChange,
        false
      );
      document.removeEventListener(
        "fullscreenchange",
        handleFullScreenChange,
        false
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullScreenChange,
        false
      );
    };
  }, [isFullScreenPlayer, setDisplayInFullScreen]);

  const shouldDisplayLyrics =
    displayInFullScreen === DisplayInFullScreen.Lyrics &&
    currentlyPlaying?.type === "track";
  const shouldDisplayQueue = displayInFullScreen === DisplayInFullScreen.Queue;
  const shouldDisplayApp =
    !isServer() &&
    isFullScreen() &&
    (shouldDisplayLyrics || shouldDisplayQueue);

  useEffect(() => {
    if (displayInFullScreen === DisplayInFullScreen.App && isFullScreen()) {
      exitFullScreen();
    }
  }, [displayInFullScreen]);

  return (
    <footer>
      <div ref={ref}>
        {isFullScreenPlayer ? <FullScreenPlayer /> : null}
        {shouldDisplayApp ? <AppContainer translations={translations} /> : null}
      </div>
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
          display: "flex";
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
        .fullScreenContainer {
          min-height: 100%;
        }
        .fullScreenContainer.lyrics {
          background-color: var(--header-color);
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
          position: relative;
          z-index: 99999999999999999999999999999999999999999999999999999999999999999999999999999;
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
