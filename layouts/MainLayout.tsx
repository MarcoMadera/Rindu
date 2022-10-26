import { useRouter } from "next/router";
import Footer from "components/Footer";
import TopBar from "components/TopBar";
import SpotifyPlayer from "components/SpotifyPlayer";
import SideBar from "components/SideBar";
import {
  MutableRefObject,
  PropsWithChildren,
  ReactElement,
  useRef,
} from "react";
import useRefreshAccessToken from "hooks/useRefreshAccessToken";
import useSpotify from "hooks/useSpotify";
import FullScreenLyrics from "components/FullScreenLyrics";

export default function MainLayout({
  children,
}: PropsWithChildren): ReactElement {
  const router = useRouter();
  const isLoginPage = router.pathname === "/";
  const appRef = useRef<HTMLDivElement>();
  const { showLyrics, currentlyPlaying } = useSpotify();
  const shouldDisplayLyrics = showLyrics && currentlyPlaying?.type === "track";

  useRefreshAccessToken();

  return (
    <>
      {isLoginPage ? (
        <>
          <div>
            <TopBar />
            {children}
          </div>
          <Footer />
        </>
      ) : (
        <>
          <div className="container">
            <SideBar />
            <div
              className="app"
              ref={appRef as MutableRefObject<HTMLDivElement>}
            >
              <TopBar appRef={appRef} />
              {shouldDisplayLyrics ? (
                <FullScreenLyrics appRef={appRef} />
              ) : (
                children
              )}
            </div>
            <style jsx>{`
              div.container {
                height: calc(100vh - 90px);
                display: flex;
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
              @media (max-width: 685px) {
                div.container {
                  height: calc(100vh - 270px);
                }
              }
            `}</style>
          </div>
          <SpotifyPlayer />
        </>
      )}
    </>
  );
}
