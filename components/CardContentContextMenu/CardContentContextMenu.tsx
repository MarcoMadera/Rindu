import { ReactElement, useCallback } from "react";

import { useRouter } from "next/router";

import { EmbedModal } from "components";
import { CardType } from "components/CardContent";
import { useContextMenu, useToast, useTranslations } from "hooks";
import { menuContextStyles } from "styles/menuContextStyles";
import { ICardContentContextMenuData } from "types/contextMenu";
import { Modify } from "types/customTypes";
import { getSiteUrl, handleAsyncError, templateReplace } from "utils";
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
  Record<SaveFunctionTypes, (id: string) => Promise<boolean | null>>
>;

const saveFunctions: SaveFunctions = {
  album: followAlbums,
  show: saveShowsToLibrary,
  artist: (id: string) => follow(Follow_type.Artist, id),
  playlist: followPlaylist,
};

export interface ICardContentContextMenu {
  data: ICardContentContextMenuData["data"];
}
export default function CardContentContextMenu({
  data,
}: Readonly<ICardContentContextMenu>): ReactElement {
  const { removeContextMenu, setModalData } = useContextMenu();
  const router = useRouter();
  const { addToast } = useToast();
  const { translations } = useTranslations();

  const saveFunction = saveFunctions[data.type];

  const handleGoToClick = useCallback(async () => {
    removeContextMenu();
    await router.push(`${getSiteUrl()}/${data.type || "track"}/${data.id}`);
  }, [data.id, data.type, removeContextMenu, router]);

  return (
    <ul>
      <li>
        <button type="button" onClick={handleAsyncError(handleGoToClick)}>
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
                message: templateReplace(translations.toastMessages.addedTo, [
                  translations.contentType.library,
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
