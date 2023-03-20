import { Dispatch, SetStateAction } from "react";

import { ICardContent } from "components/CardContent";
import { ModalContextProviderProps } from "context/ModalContext";
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
export interface ContextMenuContextProviderProps {
  contextMenuData:
    | ICardTrackContextMenuData
    | ICardContentContextMenuData
    | undefined;
  setContextMenuData: Dispatch<
    SetStateAction<ContextMenuContextProviderProps["contextMenuData"]>
  >;
  modalData: ModalContextProviderProps["modalData"];
  setModalData: ModalContextProviderProps["setModalData"];
}

export interface UseContextMenu {
  contextMenuData: ContextMenuContextProviderProps["contextMenuData"];
  addContextMenu: (
    contextMenuData: ContextMenuContextProviderProps["contextMenuData"]
  ) => void;
  removeContextMenu: () => void;
  modalData: ModalContextProviderProps["modalData"];
  setModalData: ModalContextProviderProps["setModalData"];
}
