import { Dispatch, SetStateAction } from "react";

import { ICardContent } from "components/CardContent";
import { ITrack } from "types/spotify";

export interface ICardTrackContextMenuData {
  type: "cardTrack";
  data:
    | ITrack
    | SpotifyApi.UserObjectPublic
    | SpotifyApi.PlaylistObjectFull
    | SpotifyApi.AlbumObjectFull
    | SpotifyApi.ArtistObjectFull
    | SpotifyApi.ShowObject
    | null;
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
