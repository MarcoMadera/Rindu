import { PropsWithChildren, ReactElement, ReactNode, useState } from "react";

import {
  FullScreenLyrics,
  FullScreenQueue,
  ResizablePanel,
  ScrollBar,
  SideBar,
  TopBar,
} from "components";
import { useOnSmallScreen, useSpotify } from "hooks";
import { DisplayInFullScreen } from "types/spotify";
import { ITranslations } from "types/translations";
import { isFullScreen, isServer } from "utils";

export function AppContainer({
  children,
  translations,
  source,
}: Readonly<
  PropsWithChildren<{ translations: ITranslations; source?: string }>
>): ReactElement {
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
  const isFullScreenApp =
    !isServer() &&
    isFullScreen() &&
    displayInFullScreen !== DisplayInFullScreen.App;
  useOnSmallScreen((isSmall) => {
    setHideSideBar(isSmall);
  }, 1000);

  const defaultPlayerHeight = "68";
  const isPlayingAndPlayerHidden = currentlyPlaying?.id && !shouldDisplayPlayer;
  const isPlayingAndPlayerVisible = currentlyPlaying?.id && shouldDisplayPlayer;
  function getPlayerHeight() {
    if (isPlayingAndPlayerVisible || isFullScreenApp) return "0";
    if (isPlayingAndPlayerHidden) return "150";

    return defaultPlayerHeight;
  }

  const playerHeight = getPlayerHeight();

  function renderChildren(): ReactElement | ReactNode {
    if (shouldDisplayLyrics)
      return <FullScreenLyrics source={`main-${source}`} />;

    if (shouldDisplayQueue) return <FullScreenQueue />;

    return children;
  }

  return (
    <div className="container">
      <div className="overlay"></div>
      <ResizablePanel.Group direction="row">
        <ResizablePanel.Item
          size={`${leftPanelWidth}px`}
          id="left"
          minWidth={`${leftPanelMinWidth}px`}
          maxWidth={`${leftPanelMaxWidth}px`}
        >
          <SideBar width={leftPanelWidth} translations={translations} />
          <ResizablePanel.Handle onResize={setLeftPanelDraggedWidth} />
        </ResizablePanel.Item>
        <ResizablePanel.Item defaultSize="100%" id="right">
          <ScrollBar
            className="app"
            style={{
              "--left-panel-width": `${
                hideSideBar || isFullScreenApp ? "0" : leftPanelWidth
              }px`,
            }}
          >
            <TopBar />
            {renderChildren()}
          </ScrollBar>
        </ResizablePanel.Item>
      </ResizablePanel.Group>
      <style jsx>{`
        div.container :global(#left) {
          display: ${hideSideBar || isFullScreenApp ? "none" : "grid"};
        }
        @media (max-width: 1000px) {
          div.container :global(#left) {
            display: none;
          }
          :global(.app) {
            width: 100%;
          }
        }
        div.container {
          background: ${source === "footer" || shouldDisplayLyrics
            ? "var(--lyrics-background-color)"
            : "unset"};
        }
      `}</style>

      <style jsx>{`
        div.container {
          height: ${isFullScreenApp ? "100%" : "calc(100svh - 90px)"};
          display: flex;
          width: calc(100vw + 1px);
        }
        :global(.app) {
          overflow-y: overlay;
          overflow-x: hidden;
          position: relative;
          width: calc(100vw - var(--left-panel-width, 0px));
        }
        :global(.app),
        :global(.app main) {
          height: ${isFullScreenApp ? "100%" : "calc(100svh - 90px)"};
        }
        :global(.app::-webkit-scrollbar) {
          width: 14px;
        }
        @media screen and (max-width: 768px) {
          :global(.app::-webkit-scrollbar) {
            width: 4px;
          }
        }
      `}</style>
      <style jsx>{`
        @media (max-width: 1000px) {
          div.container {
            height: calc(100svh - ${playerHeight}px);
          }
          :global(.app) {
            width: 100%;
            height: calc(100svh - ${playerHeight}px);
          }
        }
        @media (max-width: 685px) {
          :global(.app) {
            height: calc(100svh - ${playerHeight}px);
          }
        }

        @media (max-width: 685px) {
          div.container {
            height: calc(100svh - ${playerHeight}px);
          }
        }
      `}</style>
    </div>
  );
}
