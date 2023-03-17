import {
  ReactPortal,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import { CardContentContextMenu, CardTrackContextMenu } from "components";
import type { ICardContentContextMenu } from "components/CardContentContextMenu";
import { useContextMenu, useEventListener } from "hooks";
import { ITrack } from "types/spotify";
import {
  calculateContextMenuPosition,
  CONTEXT_MENU_SIDE_OFFSET,
  positionContextMenu,
} from "utils";

export default function ContextMenu(): ReactPortal | null {
  const [targetNode, setTargetNode] = useState<Element | null>();
  const { contextMenuData, removeContextMenu } = useContextMenu();
  const [contextMenuPos, setContextMenuPos] = useState({
    x: (contextMenuData?.position.x ?? 0) - 30,
    y: (contextMenuData?.position.y ?? 0) - 40,
  });
  const [isContextMenuOffscreen, setIsContextMenuOffscreen] = useState({
    x: false,
    y: false,
  });
  const contextMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTargetNode(document.querySelector("#contextMenu"));
  }, []);

  useEventListener({
    target: document.querySelector("#__next"),
    type: "click",
    listener: removeContextMenu,
    options: { once: true },
    ignore: !contextMenuData?.data,
  });

  useLayoutEffect(() => {
    positionContextMenu({
      positionData: contextMenuData,
      elementRef: contextMenuRef,
      setPosition: setContextMenuPos,
      setIsOffScreen: setIsContextMenuOffscreen,
      offsets: { x: 30, y: 10 },
    });
  }, [contextMenuData]);

  if (targetNode === null) {
    throw new Error("ContextMenu needs a target element with id: contextMenu");
  }

  if (targetNode === undefined || !contextMenuData) {
    return null;
  }

  const top = calculateContextMenuPosition(
    isContextMenuOffscreen.y,
    contextMenuPos.y,
    contextMenuData.position.y,
    CONTEXT_MENU_SIDE_OFFSET
  );
  const left = calculateContextMenuPosition(
    isContextMenuOffscreen.x,
    contextMenuPos.x,
    contextMenuData.position.x,
    CONTEXT_MENU_SIDE_OFFSET
  );

  return createPortal(
    <section ref={contextMenuRef} style={{ top, left }}>
      {contextMenuData.data?.type === "track" ||
      contextMenuData.data?.type === "episode" ? (
        <CardTrackContextMenu track={contextMenuData.data as ITrack} />
      ) : (
        <CardContentContextMenu
          data={contextMenuData.data as ICardContentContextMenu["data"]}
        />
      )}
      <style jsx>{`
        section {
          max-width: 400px;
          width: fit-content;
          position: absolute;
          margin: 0 auto;
          border-radius: 5px;
          background-color: #282828;
          box-shadow: 0px 2px 9px 0px rgb(0 0 0 / 5%);
          padding: 3px;
          max-height: 95vh;
          z-index: 999999999999;
        }
      `}</style>
    </section>,
    targetNode
  );
}
