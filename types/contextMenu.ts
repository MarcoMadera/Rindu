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

interface NewToast {
  variant: "info" | "error" | "success";
  message: string;
  displayTime?: number;
}

export interface IToast extends NewToast {
  timeOut: NodeJS.Timeout;
  id: string;
  displayTime: number;
}

export interface UseContextMenu {
  contextMenuData: ContextMenuContextProviderProps["contextMenuData"];
  addContextMenu: (
    contextMenuData: ContextMenuContextProviderProps["contextMenuData"]
  ) => void;
  removeContextMenu: () => void;
}
