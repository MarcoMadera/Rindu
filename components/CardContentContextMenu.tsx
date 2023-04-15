import { ReactElement } from "react";

import { useRouter } from "next/router";

import EmbedModal from "./EmbedModal";
import { CardType } from "components/CardContent";
import { useContextMenu, useToast, useTranslations } from "hooks";
import { menuContextStyles } from "styles/menuContextStyles";
import { ICardContentContextMenuData } from "types/contextMenu";
import {
  capitalizeFirstLetter,
  ContentType,
  getSiteUrl,
  templateReplace,
  ToastMessage,
} from "utils";
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

const saveFunctions: { [key in SaveFunctionTypes]: (id: string) => void } = {
  album: followAlbums,
  show: saveShowsToLibrary,
  artist: (id: string) => follow(Follow_type.artist, id),
  playlist: followPlaylist,
};

function saveFunction(type: SaveFunctionTypes, id: string): void {
  switch (type) {
    case CardType.ALBUM:
      saveFunctions.album(id);
      break;
    case CardType.PLAYLIST:
      saveFunctions.playlist(id);
      break;
    case CardType.ARTIST:
      saveFunctions.artist(id);
      break;
    case CardType.SHOW:
      saveFunctions.show(id);
      break;
    default:
      break;
  }
}

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

  const isSaveable =
    !!data.type && Object.keys(saveFunctions).includes(data.type);

  return (
    <ul>
      <li>
        <button
          type="button"
          onClick={() => {
            router.push(`${getSiteUrl()}/${data.type ?? "track"}/${data.id}`);
            removeContextMenu();
          }}
        >
          Go to {data.type}
        </button>
      </li>
      {data.type !== "genre" && (
        <li>
          <button
            onClick={() => {
              if (!data.type || !data.id) return;
              setModalData({
                title: "Embed",
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
      {isSaveable && (
        <li>
          <button
            type="button"
            onClick={() => {
              saveFunction(data.type as SaveFunctionTypes, data.id);
              addToast({
                message: `${capitalizeFirstLetter(
                  templateReplace(translations[ToastMessage.AddedTo], [
                    translations[ContentType.Library],
                  ])
                )}`,
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
