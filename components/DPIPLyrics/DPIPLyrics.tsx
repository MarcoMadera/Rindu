import { ReactElement, useEffect } from "react";

import { FullScreenLyrics, MiniPlayer } from "components";
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
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MiniPlayer document={pipWindow.current?.document} />
        <FullScreenLyrics document={pipWindow.current?.document} />
      </div>
      <div id="contextMenu"></div>
    </ContextMenuContextProvider>
  );
};

export default DPIPLyrics;
