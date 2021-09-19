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
  const { element } = useHeader();

  useEffect(() => {
    const app = appRef.current;
    function onScroll() {
      const newShowFixed = (app?.scrollTop || 0) > 223;
      if (showFixed !== newShowFixed) {
        setShowFixed(newShowFixed);
      }
    }
    router.events.on("routeChangeComplete", () => {
      document.getElementsByClassName("app")[0].scrollTo(0, 0);
      setShowFixed(false);
    });

    app?.addEventListener("scroll", onScroll);

    return () => {
      router.events.off("routeChangeComplete", () => {
        document.getElementsByClassName("app")[0].scrollTo(0, 0);
        setShowFixed(false);
      });
      app?.removeEventListener("scroll", onScroll);
    };
  }, [showFixed, router]);

  return (
    <div className="app" ref={appRef as MutableRefObject<HTMLDivElement>}>
      <div className="container">
        <header>
          <div className="background">
            <div className="noise"></div>
          </div>
          <RouterButtons />
          <div className="extraElement">
            {element && showFixed ? <>{element}</> : null}
          </div>
          {user ? (
            <UserConfig name={user?.name} img={user?.image} href={user?.href} />
          ) : (
            <div className="userConfig"></div>
          )}
        </header>
      </div>
      {children}
      <style jsx>{`
        .app {
          overflow-y: scroll;
          height: calc(100vh - 90px);
          overflow-x: hidden;
          width: calc(100vw - 245px);
          position: relative;
        }
        .extraElement {
          display: flex;
          width: 100%;
          align-items: center;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 32px;
          width: calc(100% - 258px);
          height: 60px;
          z-index: 999999;
          position: fixed;
        }
        div.noise {
          background-color: #00000099;
          height: 100%;
        }
        div.background {
          background-color: #797979;
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
        }
      `}</style>
    </div>
  );
}
