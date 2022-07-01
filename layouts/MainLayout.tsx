import { useRouter } from "next/router";
import Footer from "components/Footer";
import TopBar from "components/TopBar";
import SpotifyPlayer from "components/SpotifyPlayer";
import SideBar from "components/SideBar";
import { MutableRefObject, ReactElement, ReactNode, useRef } from "react";
import useRefreshAccessToken from "hooks/useRefreshAccessToken";

export default function MainLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const router = useRouter();
  const isLoginPage = router.asPath === "/";
  const appRef = useRef<HTMLDivElement>();

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
              {children}
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
