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
  const [leftPanelWidth, setLeftPanelWidth] = useState(leftPanelMinWidth);
  const contentWidth = Math.max(
    leftPanelMinWidth,
    Math.min(leftPanelWidth, leftPanelMaxWidth)
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
          <PanelResizeHandle onResize={setLeftPanelWidth} />
        </Panel>
        <Panel defaultSize="100%" id="right">
          <div className="app" ref={appRef as MutableRefObject<HTMLDivElement>}>
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
        div.container {
          height: calc(100vh - 90px);
          display: flex;
          width: calc(100vw + 1px);
        }
        @media (max-width: 1000px) {
          div.container :global(#left) {
            display: ${showHamburgerMenu ? "grid" : "none"};
          }
        }
        .app {
          overflow-y: overlay;
          height: calc(100vh - 90px);
          overflow-x: hidden;
          width: calc(100vw - ${contentWidth - 1}px);
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
