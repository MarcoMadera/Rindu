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
  useState,
} from "react";
import useRefreshAccessToken from "hooks/useRefreshAccessToken";
import useSpotify from "hooks/useSpotify";
import FullScreenLyrics from "components/FullScreenLyrics";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "components/ResizablePanel";

function AppContainer({ children }: PropsWithChildren): ReactElement {
  const appRef = useRef<HTMLDivElement>();
  const { showLyrics, currentlyPlaying, showHamburgerMenu } = useSpotify();
  const shouldDisplayLyrics = showLyrics && currentlyPlaying?.type === "track";
  const leftPanelMinWidth = 245;
  const leftPanelMaxWidth = 400;
  const [leftPanelDraggedWidth, setLeftPanelDraggedWidth] =
    useState(leftPanelMinWidth);
  const leftPanelWidth = Math.max(
    leftPanelMinWidth,
    Math.min(leftPanelDraggedWidth, leftPanelMaxWidth)
  );

  return (
    <div className="container">
      <PanelGroup direction="row">
        <Panel
          defaultSize={`${leftPanelWidth}px`}
          id="left"
          minWidth={`${leftPanelMinWidth}px`}
          maxWidth={`${leftPanelMaxWidth}px`}
        >
          <SideBar />
          <PanelResizeHandle onResize={setLeftPanelDraggedWidth} />
        </Panel>
        <Panel defaultSize="100%" id="right">
          <div
            className="app"
            ref={appRef as MutableRefObject<HTMLDivElement>}
            style={{
              "--left-panel-width": `${leftPanelWidth}px`,
            }}
          >
            <TopBar appRef={appRef} />
            {shouldDisplayLyrics ? (
              <FullScreenLyrics appRef={appRef} />
            ) : (
              children
            )}
          </div>
        </Panel>
      </PanelGroup>
      <style jsx>{`
        @media (max-width: 1000px) {
          div.container :global(#left) {
            display: ${showHamburgerMenu ? "grid" : "none"};
          }
          .app {
            width: 100%;
          }
        }
      `}</style>
      <style jsx>{`
        div.container {
          height: calc(100vh - 90px);
          display: flex;
          width: calc(100vw + 1px);
        }
        .app {
          overflow-y: overlay;
          height: calc(100vh - 90px);
          overflow-x: hidden;
          position: relative;
          width: calc(100vw - var(--left-panel-width, 0) + 2px);
        }
        .app::-webkit-scrollbar {
          width: 14px;
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
  );
}

export default function MainLayout({
  children,
}: PropsWithChildren): ReactElement {
  const router = useRouter();
  const isLoginPage = router.pathname === "/";

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
          <AppContainer>{children}</AppContainer>
          <SpotifyPlayer />
        </>
      )}
    </>
  );
}
