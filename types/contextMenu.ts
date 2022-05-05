import { Dispatch, SetStateAction } from "react";
import { normalTrackTypes } from "./spotify";

export interface ContextMenuContextProviderProps {
  contextMenuData:
    | {
        type: "cardTrack";
        data: normalTrackTypes;
        position: { x: number; y: number };
      }
    | undefined;
  setContextMenuData: Dispatch<
    SetStateAction<ContextMenuContextProviderProps["contextMenuData"]>
  >;
}

export interface UseContextMenu {
  contextMenuData: ContextMenuContextProviderProps["contextMenuData"];
  addContextMenu: (
    contextMenuData: ContextMenuContextProviderProps["contextMenuData"]
  ) => void;
  removeContextMenu: () => void;
}
