import { ReactElement, useEffect, useState } from "react";

import {
  CardContentContextMenu,
  CardTrackContextMenu,
  PortalTarget,
} from "components";
import type { ICardContentContextMenu } from "components/CardContentContextMenu";
import { useContextMenu, useEventListener } from "hooks";
import type { ITrack } from "types/spotify";
import {
  calculateContextMenuPosition,
  CONTEXT_MENU_SIDE_OFFSET,
  positionContextMenu,
} from "utils";

export default function ContextMenu(): ReactElement | null {
  const { contextMenuData, removeContextMenu } = useContextMenu();
  const [contextMenuPos, setContextMenuPos] = useState({
    x: (contextMenuData?.position.x ?? 0) - 30,
    y: (contextMenuData?.position.y ?? 0) - 40,
  });
  const [isContextMenuOffscreen, setIsContextMenuOffscreen] = useState({
    x: false,
    y: false,
  });
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEventListener({
    target: document.querySelector("#__next"),
    type: "click",
    listener: removeContextMenu,
    options: { once: true },
    ignore: !contextMenuData?.data,
  });

  useEffect(() => {
    positionContextMenu({
      currentPosition: contextMenuData?.position,
      element: element,
      setPosition: setContextMenuPos,
      setIsOffScreen: setIsContextMenuOffscreen,
      offsets: { x: 30, y: 10 },
    });
  }, [contextMenuData?.position, element]);

  if (!contextMenuData) {
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

  return (
    <PortalTarget targetId="contextMenu">
      <section
        role="menu"
        data-type={contextMenuData.data?.type}
        ref={(element) => setElement(element)}
        style={{ top, left }}
      >
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
      </section>
    </PortalTarget>
  );
}
