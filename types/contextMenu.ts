import { Dispatch, SetStateAction } from "react";

import { ICardContent } from "components/CardContent";
import { IModalContext } from "context/ModalContext";
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
  type: "cardContent" | "cardTrack";
  data: {
    type: ICardContent["type"];
    id: ICardContent["id"];
    uri?: ITrack["uri"];
  };
  position: { x: number; y: number };
}
export interface IContextMenuContext {
  contextMenuData:
    | ICardTrackContextMenuData
    | ICardContentContextMenuData
    | undefined;
  setContextMenuData: Dispatch<
    SetStateAction<IContextMenuContext["contextMenuData"]>
  >;
  modalData: IModalContext["modalData"];
  setModalData: IModalContext["setModalData"];
}

export interface UseContextMenu {
  contextMenuData: IContextMenuContext["contextMenuData"];
  addContextMenu: (
    contextMenuData: IContextMenuContext["contextMenuData"]
  ) => void;
  removeContextMenu: () => void;
  modalData: IModalContext["modalData"];
  setModalData: IModalContext["setModalData"];
}
