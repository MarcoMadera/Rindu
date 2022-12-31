import TopBar from "components/TopBar";
import SideBar from "components/SideBar";
import {
  MutableRefObject,
  PropsWithChildren,
  ReactElement,
  useRef,
  useState,
} from "react";
import useSpotify from "hooks/useSpotify";
import FullScreenLyrics from "components/FullScreenLyrics";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "components/ResizablePanel";
import { DisplayInFullScreen } from "types/spotify";
import FullScreenQueue from "../components/FullScreenQueue";

export function AppContainer({ children }: PropsWithChildren): ReactElement {
  const appRef = useRef<HTMLDivElement>();
  const { displayInFullScreen, currentlyPlaying, hideSideBar } = useSpotify();
  const shouldDisplayLyrics =
    displayInFullScreen === DisplayInFullScreen.Lyrics &&
    currentlyPlaying?.type === "track";
  const shouldDisplayQueue = displayInFullScreen === DisplayInFullScreen.Queue;
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
            ) : shouldDisplayQueue ? (
              <FullScreenQueue />
            ) : (
              children
            )}
          </div>
        </Panel>
      </PanelGroup>
      <style jsx>{`
        @media (max-width: 1000px) {
          div.container :global(#left) {
            display: ${hideSideBar ? "grid" : "none"};
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
      `}</style>
      <style jsx>{`
        @media (max-width: 1000px) {
          div.container {
            height: calc(100vh - ${currentlyPlaying?.id ? "150" : "68"}px);
          }
          .app {
            width: 100%;
            height: calc(100vh - ${currentlyPlaying?.id ? "150" : "68"}px);
          }
        }
        @media (max-width: 685px) {
          .app {
            height: calc(100vh - ${currentlyPlaying?.id ? "150" : "68"}px);
          }
        }

        @media (max-width: 685px) {
          div.container {
            height: calc(100vh - ${currentlyPlaying?.id ? "150" : "68"}px);
          }
        }
      `}</style>
    </div>
  );
}
