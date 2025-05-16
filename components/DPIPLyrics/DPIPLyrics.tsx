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
        position: absolute;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
      }

      .resize-panel {
        position: relative;
      }

      .resize-handle.vertical {
        bottom: -6px;
        left: 0;
        right: 0;
        height: 24px;
        cursor: ns-resize;
      }

      .resize-grip {
        width: 36px;
        height: 4px;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.2);
        opacity: 0;
        transform: scale(1);
        transition: opacity 0.2s ease, background 0.2s ease, transform 0.2s ease;
      }

      .resize-panel:hover .resize-grip,
      .resize-handle:hover .resize-grip {
        opacity: 1;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(1.05);
      }

      .resize-grip.active {
        opacity: 1 !important;
        background: rgba(255, 255, 255, 0.7);
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
            direction="vertical"
            waitForImages={true}
            observeResize={true}
            maxSize="fit-content"
            minSize="125px"
            className="player-container"
            document={pipWindow.current?.document}
            defaultSize="450px"
            initialExpanded={true}
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
