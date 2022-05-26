import useAuth from "hooks/useAuth";
import {
  MutableRefObject,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import UserConfig from "./navbar/UserConfig";
import RouterButtons from "./RouterButtons";
import { useRouter } from "next/router";
import useHeader from "hooks/useHeader";
import useSpotify from "hooks/useSpotify";

export default function Header({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const router = useRouter();
  const appRef = useRef<HTMLDivElement>();
  const { user } = useAuth();
  const {
    headerColor,
    element,
    displayOnFixed,
    alwaysDisplayColor,
    headerOpacity,
    setHeaderOpacity,
    disableOpacityChange,
  } = useHeader();
  const isPremium = user?.product === "premium";
  const { setShowHamburguerMenu } = useSpotify();
  const [showFixed, setShowFixed] = useState(false);

  useEffect(() => {
    const app = appRef.current;
    function onScroll() {
      const headerOpacityPercentage = ((app?.scrollTop || 0) + -55) / 223;
      const headerOpacity =
        headerOpacityPercentage > 1 ? 1 : headerOpacityPercentage;
      setHeaderOpacity(headerOpacity);

      if ((app?.scrollTop || 0) > 223) {
        setShowFixed(true);
      } else {
        setShowFixed(false);
      }
    }

    router.events.on("routeChangeComplete", () => {
      document.getElementsByClassName("app")?.[0]?.scrollTo(0, 0);
      if (!alwaysDisplayColor) {
        setHeaderOpacity(0);
      }
    });

    app?.addEventListener("scroll", onScroll);

    return () => {
      router.events.off("routeChangeComplete", () => {
        document.getElementsByClassName("app")?.[0]?.scrollTo(0, 0);
        setHeaderOpacity(0);
      });
      app?.removeEventListener("scroll", onScroll);
    };
  }, [router, alwaysDisplayColor, setHeaderOpacity]);

  return (
    <div
      className="app"
      id="app"
      ref={appRef as MutableRefObject<HTMLDivElement>}
    >
      <div className="container">
        <header>
          <div
            className="background"
            style={{
              opacity: alwaysDisplayColor
                ? 1
                : disableOpacityChange && !showFixed
                ? 0
                : headerOpacity,
            }}
          >
            <div className="noise"></div>
          </div>
          <button
            onClick={() => {
              setShowHamburguerMenu((prev) => !prev);
            }}
            className="hamburguerMenu"
          >
            <div className="hamburguerMenu-line"></div>
            <div className="hamburguerMenu-line"></div>
            <div className="hamburguerMenu-line"></div>
          </button>
          <RouterButtons />
          <div className="extraElement">
            {displayOnFixed || (element && headerOpacity === 1) ? (
              <>{element}</>
            ) : null}
          </div>
          {!isPremium ? (
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
            <UserConfig
              name={user?.display_name}
              img={user?.images?.[0]?.url}
            />
          ) : (
            <div className="userConfig"></div>
          )}
        </header>
      </div>
      {alwaysDisplayColor && <div className="bg-12"></div>}
      {children}
      <style jsx>{`
        .bg-12 {
          background-image: linear-gradient(rgba(0, 0, 0, 0.6) 0, #121212 100%),
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=");
          height: 232px;
          position: absolute;
          width: 100%;
          background-color: ${headerColor ?? "transparent"};
          transition: background-color 0.3s ease;
        }
        .hamburguerMenu {
          width: 50px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-direction: column;
          background: none;
          border: none;
          margin-right: 20px;
          display: none;
        }
        @media (max-width: 1000px) {
          .hamburguerMenu {
            display: flex;
          }
        }
        .hamburguerMenu-line {
          background-color: #fff;
          height: 2px;
          width: 30px;
          margin: 4px 5px;
        }
        .app {
          overflow-y: overlay;
          height: calc(100vh - 90px);
          overflow-x: hidden;
          width: calc(100vw - 245px);
          position: relative;
        }
        @media (max-width: 685px) {
          .app {
            height: calc(100vh - 270px);
          }
        }
        @media (max-width: 1000px) {
          .app {
            width: 100%;
          }
        }
        .extraElement {
          white-space: nowrap;
          width: 100%;
          min-width: 0;
          z-index: 2;
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
          background-color: ${headerColor ?? "#797979"};
          bottom: 0;
          left: 0;
          overflow: hidden;
          pointer-events: none;
          position: absolute;
          right: 0;
          top: 0;
          transition: background-color 0.3s;
          z-index: -1;
        }
        .container {
          height: 60px;
          position: sticky;
          top: 0px;
          z-index: 9999999999;
        }
      `}</style>
    </div>
  );
}
