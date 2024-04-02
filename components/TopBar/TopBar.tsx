import { MutableRefObject, ReactElement, useState } from "react";

import { useRouter } from "next/router";

import { LoginButton, Logo, RouterButtons, UserWidget } from "components";
import { Chevron } from "components/icons/";
import { useAuth, useHeader, useRouterEvents, useSpotify } from "hooks";
import { DisplayInFullScreen } from "types/spotify";
import {
  calculateBannerOpacity,
  calculateHeaderOpacity,
  chooseImage,
  isFullScreen,
  isServer,
  setOpacityStyles,
} from "utils";

interface TopBarProps {
  appRef?: MutableRefObject<HTMLDivElement | null>;
}

export default function TopBar({
  appRef,
}: Readonly<TopBarProps>): ReactElement {
  const { user, isPremium } = useAuth();
  const { element, displayOnFixed, disableBackground, disableOpacityChange } =
    useHeader();
  const router = useRouter();
  const isLoginPage = router.pathname === "/";
  const [displayElement, setDisplayElement] = useState(false);
  const { setDisplayInFullScreen, displayInFullScreen } = useSpotify();

  useRouterEvents(() => {
    const app =
      appRef?.current ??
      document.querySelector("#right .simplebar-content-wrapper");
    const scrollTop = app?.scrollTop || 0;
    const headerOpacity = calculateHeaderOpacity({
      scrollTop,
      disableOpacityChange,
      displayOnFixed,
      disableBackground,
    });
    const bannerOpacity = calculateBannerOpacity({
      scrollTop,
    });

    setOpacityStyles({
      headerOpacity,
      bannerOpacity,
    });

    setDisplayElement(headerOpacity >= 1 && !!element);
  });

  if (isLoginPage) {
    return (
      <header>
        <div>
          <Logo color="#000" />
          <LoginButton />
        </div>
        <style jsx>{`
          header {
            height: 64px;
            background-color: #ffffff;
            padding: 0 20px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
            margin: 0 auto;
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0;
            z-index: 9129192;
          }
          div {
            max-width: 1568px;
            width: 100%;
            padding-left: 64px;
            padding-right: 64px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 auto;
          }
          @media screen and (min-width: 0px) and (max-width: 780px) {
            header {
              padding: 0;
            }
            div {
              padding: 15px;
            }
          }
        `}</style>
      </header>
    );
  }

  const isFullScreenApp =
    !isServer() &&
    isFullScreen() &&
    displayInFullScreen !== DisplayInFullScreen.App;

  return (
    <>
      <div className="container">
        <header>
          <div className="background" id="header-top-bar-background">
            <div className="noise"></div>
          </div>
          <RouterButtons />
          <div className="back-to-player">
            <button
              type="button"
              aria-label={"Back to player"}
              onClick={(e) => {
                e.stopPropagation();
                setDisplayInFullScreen(DisplayInFullScreen.Player);
              }}
            >
              <Chevron rotation={"270deg"} />
            </button>
          </div>
          <div className="extraElement">
            {displayElement || displayOnFixed ? element : null}
          </div>
          {user && !isPremium ? (
            <a
              href="https://www.spotify.com/premium/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Upgrade to Premium"
              title="Upgrade to Premium"
            >
              UPGRADE
            </a>
          ) : null}
          {user ? (
            <UserWidget
              name={user.display_name}
              img={chooseImage(user.images, 40).url}
            />
          ) : (
            <div className="userWidget"></div>
          )}
        </header>
      </div>
      {!disableBackground && <div className="bg-12"></div>}
      <style jsx>{`
        .back-to-player {
          display: ${isFullScreenApp ? "block" : "none"};
        }
        .back-to-player button {
          opacity: 1;
          top: 5px;
          right: 5px;
          width: 40px;
          height: 40px;
          background-color: rgba(214, 214, 214, 0.311);
          z-index: 1;
          cursor: auto;
          border: none;
          border-radius: 50%;
          color: #ffffffb3;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          animation: border-animation 1s ease-in-out;
          animation-iteration-count: 3;
        }
        .back-to-player button:hover {
          background-color: rgba(255, 255, 255, 0.45);
        }
        .back-to-player button:focus {
          outline: none;
        }
        .back-to-player button:active {
          background-color: rgba(255, 255, 255, 0.1);
        }
        @keyframes border-animation {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        .bg-12 {
          background-image: linear-gradient(rgba(0, 0, 0, 0.6) 0, #121212 100%),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
          height: 294px;
          position: absolute;
          width: 100%;
          background-color: var(--header-color, transparent);
          transition: background-color 1s ease;
          margin-top: -61px;
        }
        .extraElement {
          white-space: nowrap;
          width: 100%;
          min-width: 0;
          z-index: 2;
          display: flex;
        }
        a {
          border-radius: 500px;
          text-decoration: none;
          color: #fff;
          cursor: pointer;
          display: inline-block;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.76px;
          line-height: 18px;
          padding: 8px 34px;
          text-align: center;
          text-transform: uppercase;
          transition: all 33ms cubic-bezier(0.3, 0, 0, 1);
          white-space: nowrap;
          background-color: #000000b3;
          border: 1px solid #ffffffb3;
          will-change: transform;
        }
        a:focus,
        a:hover {
          transform: scale(1.06);
          background-color: #000;
          border: 1px solid #fff;
        }
        a:active {
          transform: scale(1);
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          width: 100%;
          height: 60px;
        }
        div.noise {
          background-color: #00000099;
          height: 100%;
        }
        div.background {
          background-color: var(--header-color, #797979);
          opacity: var(--header-opacity, 0);
          bottom: 0;
          left: 0;
          overflow: hidden;
          pointer-events: none;
          position: absolute;
          right: 0;
          top: 0;
          transition: background-color 0.25s;
          z-index: -1;
          pointer-events: none;
        }
        .container {
          height: 60px;
          position: fixed;
          top: 0px;
          z-index: 9999999999;
          width: calc(100vw - var(--left-panel-width, 0px) + 2px);
        }
        @media screen and (max-width: 768px) {
          .extraElement {
            display: none;
          }
          header {
            padding: 0 8px;
          }
        }
      `}</style>
    </>
  );
}
