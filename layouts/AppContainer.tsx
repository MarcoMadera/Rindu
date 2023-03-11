import {
  MutableRefObject,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FullScreenLyrics,
  FullScreenQueue,
  Panel,
  PanelGroup,
  PanelResizeHandle,
  SideBar,
  TopBar,
} from "components";
import { useOnSmallScreen, useSpotify } from "hooks";
import FullScreenPlayer from "layouts/FullScreenPlayer";
import { DisplayInFullScreen } from "types/spotify";
import { requestFullScreen } from "utils";

export function AppContainer({ children }: PropsWithChildren): ReactElement {
  const appRef = useRef<HTMLDivElement>();
  const { displayInFullScreen, currentlyPlaying, hideSideBar, setHideSideBar } =
    useSpotify();
  const shouldDisplayLyrics =
    displayInFullScreen === DisplayInFullScreen.Lyrics &&
    currentlyPlaying?.type === "track";
  const shouldDisplayQueue = displayInFullScreen === DisplayInFullScreen.Queue;
  const shouldDisplayPlayer =
    displayInFullScreen === DisplayInFullScreen.Player;
  const leftPanelMinWidth = 245;
  const leftPanelMaxWidth = 400;
  const [leftPanelDraggedWidth, setLeftPanelDraggedWidth] =
    useState(leftPanelMinWidth);
  const leftPanelWidth = Math.max(
    leftPanelMinWidth,
    Math.min(leftPanelDraggedWidth, leftPanelMaxWidth)
  );
  useOnSmallScreen((isSmall) => {
    setHideSideBar(isSmall || shouldDisplayPlayer);
  }, 1000);

  const playerHeight =
    currentlyPlaying?.id && shouldDisplayPlayer
      ? "0"
      : currentlyPlaying?.id && !shouldDisplayPlayer
      ? "150"
      : "68";

  useEffect(() => {
    if (shouldDisplayPlayer && appRef.current) {
      requestFullScreen(appRef.current);
    }
  }, [shouldDisplayPlayer]);

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
              "--left-panel-width": `${hideSideBar ? "0" : leftPanelWidth}px`,
            }}
          >
            <TopBar appRef={appRef} />
            {shouldDisplayLyrics ? (
              <FullScreenLyrics appRef={appRef} />
            ) : shouldDisplayQueue ? (
              <FullScreenQueue />
            ) : shouldDisplayPlayer ? (
              <FullScreenPlayer />
            ) : (
              children
            )}
          </div>
        </Panel>
      </PanelGroup>
      <style jsx>{`
        div.container :global(#left) {
          display: ${hideSideBar ? "none" : "grid"};
        }
        @media (max-width: 1000px) {
          div.container :global(#left) {
            display: none;
          }
          .app {
            width: 100%;
          }
        }
      `}</style>

      <style jsx>{`
        div.container {
          height: calc(
            (var(--vh, 1vh) * 100) - ${shouldDisplayPlayer ? "0" : "90px"}
          );
          display: flex;
          width: calc(100vw + 1px);
        }
        .app {
          overflow-y: overlay;
          height: calc(
            (var(--vh, 1vh) * 100) - ${shouldDisplayPlayer ? "0" : "90px"}
          );
          overflow-x: hidden;
          position: relative;
          width: calc(100vw - var(--left-panel-width, 0) + 2px);
        }
        .app::-webkit-scrollbar {
          width: 14px;
        }
        @media screen and (max-width: 768px) {
          .app::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>
      <style jsx>{`
        @media (max-width: 1000px) {
          div.container {
            height: calc((var(--vh, 1vh) * 100) - ${playerHeight}px);
          }
          .app {
            width: 100%;
            height: calc((var(--vh, 1vh) * 100) - ${playerHeight}px);
          }
        }
        @media (max-width: 685px) {
          .app {
            height: calc((var(--vh, 1vh) * 100) - ${playerHeight}px);
          }
        }

        @media (max-width: 685px) {
          div.container {
            height: calc((var(--vh, 1vh) * 100) - ${playerHeight}px);
          }
        }
      `}</style>
    </div>
  );
}
