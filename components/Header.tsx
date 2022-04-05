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

export default function Header({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const [showFixed, setShowFixed] = useState(false);
  const router = useRouter();
  const appRef = useRef<HTMLDivElement>();
  const { user } = useAuth();
  const { headerColor, element, displayOnFixed } = useHeader();
  const isPremium = user?.product === "premium";

  useEffect(() => {
    const app = appRef.current;
    function onScroll() {
      const newShowFixed = (app?.scrollTop || 0) > 223;
      if (showFixed !== newShowFixed) {
        setShowFixed(newShowFixed);
      }
    }
    router.events.on("routeChangeComplete", () => {
      document.getElementsByClassName("app")?.[0]?.scrollTo(0, 0);
      setShowFixed(false);
    });

    app?.addEventListener("scroll", onScroll);

    return () => {
      router.events.off("routeChangeComplete", () => {
        document.getElementsByClassName("app")?.[0]?.scrollTo(0, 0);
        setShowFixed(false);
      });
      app?.removeEventListener("scroll", onScroll);
    };
  }, [showFixed, router]);

  return (
    <div
      className="app"
      id="app"
      ref={appRef as MutableRefObject<HTMLDivElement>}
    >
      <div className="container">
        <header>
          <div className="background">
            <div className="noise"></div>
          </div>
          <RouterButtons />
          <div className="extraElement">
            {displayOnFixed || (element && showFixed) ? <>{element}</> : null}
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
            <UserConfig name={user?.display_name} img={user?.images?.[0].url} />
          ) : (
            <div className="userConfig"></div>
          )}
        </header>
      </div>
      {children}
      <style jsx>{`
        .app {
          overflow-y: overlay;
          height: calc(100vh - 90px);
          overflow-x: hidden;
          width: calc(100vw - 245px);
          position: relative;
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
          opacity: ${showFixed ? 1 : 0};
          bottom: 0;
          left: 0;
          overflow: hidden;
          pointer-events: none;
          position: absolute;
          right: 0;
          top: 0;
          transition: background-color 0.25s;
          z-index: -1;
        }
        .container {
          height: 60px;
          z-index: 1;
          position: sticky;
          top: 0px;
          z-index: 4;
        }
      `}</style>
    </div>
  );
}
