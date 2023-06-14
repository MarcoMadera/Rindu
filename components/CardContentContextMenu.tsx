import { ReactElement } from "react";

import { useRouter } from "next/router";

import EmbedModal from "./EmbedModal";
import { CardType } from "components/CardContent";
import { useContextMenu, useToast, useTranslations } from "hooks";
import { menuContextStyles } from "styles/menuContextStyles";
import { ICardContentContextMenuData } from "types/contextMenu";
import { Modify } from "types/customTypes";
import { ContentType, getSiteUrl, templateReplace, ToastMessage } from "utils";
import {
  follow,
  followAlbums,
  followPlaylist,
  saveShowsToLibrary,
} from "utils/spotifyCalls";
import { Follow_type } from "utils/spotifyCalls/follow";

type SaveFunctionTypes =
  | CardType.ALBUM
  | CardType.PLAYLIST
  | CardType.ARTIST
  | CardType.SHOW;

type SaveFunctions = Modify<
  Partial<Record<CardType, never>>,
  Record<SaveFunctionTypes, (id: string) => void>
>;

const saveFunctions: SaveFunctions = {
  album: followAlbums,
  show: saveShowsToLibrary,
  artist: (id: string) => follow(Follow_type.artist, id),
  playlist: followPlaylist,
};

export interface ICardContentContextMenu {
  data: ICardContentContextMenuData["data"];
}
export default function CardContentContextMenu({
  data,
}: ICardContentContextMenu): ReactElement {
  const { removeContextMenu, setModalData } = useContextMenu();
  const router = useRouter();
  const { addToast } = useToast();
  const { translations } = useTranslations();

  const saveFunction = saveFunctions[data.type];

  return (
    <ul>
      <li>
        <button
          type="button"
          onClick={() => {
            router.push(`${getSiteUrl()}/${data.type || "track"}/${data.id}`);
            removeContextMenu();
          }}
        >
          Go to {data.type || "track"}
        </button>
      </li>
      {data.type && data.type !== "genre" && data.id && (
        <li>
          <button
            onClick={() => {
              setModalData({
                title: `Embed ${data.type}`,
                modalElement: <EmbedModal type={data.type} id={data.id} />,
                maxHeight: "100%",
              });
              removeContextMenu();
            }}
          >
            Embed {data.type}
          </button>
        </li>
      )}
      {saveFunction && (
        <li>
          <button
            type="button"
            onClick={() => {
              saveFunction(data.id);
              addToast({
                message: templateReplace(translations[ToastMessage.AddedTo], [
                  translations[ContentType.Library],
                ]),
                variant: "success",
              });
              removeContextMenu();
            }}
          >
            Save {data.type}
          </button>
        </li>
      )}
      <style jsx>{menuContextStyles}</style>
    </ul>
  );
}
