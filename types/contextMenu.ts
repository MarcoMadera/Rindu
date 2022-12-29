import { Dispatch, SetStateAction } from "react";
import { ITrack } from "./spotify";
import { ICardContent } from "../components/CardContent";

export interface ICardTrackContextMenuData {
  type: "cardTrack";
  data: ITrack;
  position: { x: number; y: number };
}

export interface ICardContentContextMenuData {
  type: "cardContent";
  data: { type: ICardContent["type"]; id: ICardContent["id"] };
  position: { x: number; y: number };
}
export interface ContextMenuContextProviderProps {
  contextMenuData:
    | ICardTrackContextMenuData
    | ICardContentContextMenuData
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
