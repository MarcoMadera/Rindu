import { ReactElement, useEffect } from "react";

import { FullScreenLyrics, MiniPlayer, ResizablePanel } from "components";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { useDisableGlobalContextMenu, useSpotify } from "hooks";

export const DPIPLyrics = (): ReactElement => {
  const { pipWindow } = useSpotify();
  useDisableGlobalContextMenu(pipWindow.current ?? undefined);
  useEffect(() => {
    if (!pipWindow.current) return;
    const { document: pipDoc } = pipWindow.current;

    pipDoc.documentElement.style.cssText = "";
    pipDoc.body.style.cssText = "";

    pipDoc.body.style.margin = "0";
    pipDoc.body.style.padding = "0";
    pipDoc.body.style.minHeight = "100svh";
    pipDoc.body.style.display = "contents";

    const style = document.createElement("style");
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      html,body{
        height: 100svh;
        width: 100vw;
        max-height: 100svh;
        min-height: 100svh;
        overflow: hidden;
        background-color: black;
        display: contents;
        position: fixed;
      }

      .resize-handle {
        background: transparent;
        position: absolute;
        z-index: 1000000000;
      }

      .resize-handle.horizontal {
        right: -6px;
        top: 0;
        bottom: 0;
        width: 12px;
      }

      .resize-handle.vertical {
        bottom: -6px;
        left: 0;
        right: 0;
        height: 12px;
      }

      .resize-handle:hover .resize-handle-line {
        background: rgba(255, 255, 255, 0.3);
      }

      .resize-handle-line {
        background: transparent;
        position: absolute;
        transition: background 0.2s ease;
      }
      .resize-handle-line.resizing {
        background: "rgba(255, 255, 255, 0.3)";
      }

      .horizontal .resize-handle-line {
        right: 6px;
        top: 0;
        bottom: 0;
        width: 1px;
      }

      .vertical .resize-handle-line {
        bottom: 6px;
        left: 0;
        right: 0;
        height: 1px;
      }

      .lyrics-container-container {
        min-height: 0;
        margin-top: 0;
        margin-bottom: 0;
        display: flex;
        position: relative;
      }
    `;
    pipDoc.head.appendChild(style);

    return () => {
      pipDoc.documentElement.style.cssText = "";
      pipDoc.body.style.cssText = "";
      pipDoc.head.removeChild(style);
    };
  }, [pipWindow]);

  return (
    <ContextMenuContextProvider document={pipWindow.current?.document}>
      <div
        className="pipApp"
        style={{
          width: "100%",
          height: "100svh",
          flexDirection: "column",
          position: "relative",
          display: "flex",
        }}
      >
        <ResizablePanel.Group direction="column">
          <ResizablePanel.Panel
            id="top-panel"
            direction="vertical"
            waitForImages={true}
            observeResize={true}
            maxSize="450px"
            minSize="124px"
            className="player-container"
            document={pipWindow.current?.document}
          >
            <MiniPlayer document={pipWindow.current?.document} />
          </ResizablePanel.Panel>
          <div style={{ flex: 1 }} className="lyrics-container-container">
            <FullScreenLyrics document={pipWindow.current?.document} />
          </div>
        </ResizablePanel.Group>
      </div>
      <div id="contextMenu"></div>
    </ContextMenuContextProvider>
  );
};

export default DPIPLyrics;
