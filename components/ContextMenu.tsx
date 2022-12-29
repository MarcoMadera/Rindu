import { createPortal } from "react-dom";
import {
  ReactPortal,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useContextMenu from "hooks/useContextMenu";
import { ITrack } from "types/spotify";
import { CardTrackContextMenu } from "./CardTrackContextMenu";
import {
  CardContentContextMenu,
  ICardContentContextMenu,
} from "./CardContentContextMenu";

export default function ContextMenu(): ReactPortal | null {
  const [targetNode, setTargetNode] = useState<Element | null>();
  const { contextMenuData, removeContextMenu } = useContextMenu();
  const [isDifferentPosX, setIsDifferentPosX] = useState<boolean>(false);
  const [isDifferentPosY, setIsDifferentPosY] = useState<boolean>(false);
  const [contextMenuPos, setContextMenuPos] = useState({
    x: (contextMenuData?.position.x ?? 0) - 30,
    y: (contextMenuData?.position.y ?? 0) - 40,
  });
  const contextMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTargetNode(document.querySelector("#contextMenu"));
  }, []);

  useEffect(() => {
    if (!contextMenuData) return;

    document
      .querySelector("#__next")
      ?.addEventListener("click", removeContextMenu, { once: true });
    return () => {
      document
        .querySelector("#__next")
        ?.removeEventListener("click", removeContextMenu);
    };
  }, [contextMenuData, removeContextMenu]);

  useLayoutEffect(() => {
    if (
      (!contextMenuData?.position.x && !contextMenuData?.position.y) ||
      !contextMenuRef.current
    ) {
      setIsDifferentPosX(false);
      setIsDifferentPosY(false);
      return;
    }
    const contextMenuRectWidth =
      contextMenuRef.current.getClientRects()[0]?.width || 0;
    const contextMenuRectHeight =
      contextMenuRef.current.getClientRects()[0]?.height || 0;
    const isContextMenuWidthOffScreen =
      contextMenuData.position.x &&
      innerWidth - contextMenuData.position.x < contextMenuRectWidth;
    const isContextMenuHeightOffScreen =
      contextMenuData.position.y &&
      innerHeight - contextMenuData.position.y < contextMenuRectHeight;
    if (isContextMenuWidthOffScreen) {
      setContextMenuPos((prevState) => ({
        ...prevState,
        x: innerWidth - contextMenuRectWidth - 30,
      }));
      setIsDifferentPosX(true);
    }
    if (isContextMenuHeightOffScreen) {
      setContextMenuPos((prevState) => ({
        ...prevState,
        y: innerHeight - contextMenuRectHeight - 10,
      }));
      setIsDifferentPosY(true);
    }
    if (!isContextMenuWidthOffScreen && !isContextMenuHeightOffScreen) {
      setIsDifferentPosX(false);
      setIsDifferentPosY(false);
    }

    return () => {
      setIsDifferentPosX(false);
      setIsDifferentPosY(false);
    };
  }, [contextMenuData?.position?.x, contextMenuData?.position?.y]);

  if (targetNode === null) {
    throw new Error("ContextMenu needs a target element with id: contextMenu");
  }

  if (targetNode === undefined || !contextMenuData) {
    return null;
  }

  const top = isDifferentPosY
    ? contextMenuPos.y
    : !contextMenuData.position.y || contextMenuData.position.y < 45
    ? 50
    : contextMenuData.position.y;
  const left = isDifferentPosX
    ? contextMenuPos.x
    : !contextMenuData.position.x || contextMenuData.position.x < 45
    ? 50
    : contextMenuData.position.x;

  return createPortal(
    <section
      ref={contextMenuRef}
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
    >
      {contextMenuData.data.type === "track" ||
      contextMenuData.data.type === "episode" ? (
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
