import { useContextMenu, useToast } from "hooks";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { menuContextStyles } from "styles/menuContextStyles";
import { ICardContentContextMenuData } from "types/contextMenu";
import { capitalizeFirstLetter } from "utils/capitalizeFirstLetter";
import { getSiteUrl } from "utils/environment";
import { follow, Follow_type } from "utils/spotifyCalls/follow";
import { followAlbums } from "utils/spotifyCalls/followAlbums";
import { followPlaylist } from "utils/spotifyCalls/followPlaylist";
import { saveShowsToLibrary } from "utils/spotifyCalls/saveShowsToLibrary";
import { CardType } from "./CardContent";

type SaveFunctionTypes =
  | CardType.ALBUM
  | CardType.PLAYLIST
  | CardType.ARTIST
  | CardType.SHOW;

const saveFunctions: { [key in SaveFunctionTypes]: (id: string) => void } = {
  [CardType.ALBUM]: followAlbums,
  [CardType.SHOW]: saveShowsToLibrary,
  [CardType.ARTIST]: (id: string) => follow(Follow_type.artist, id),
  [CardType.PLAYLIST]: followPlaylist,
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
export function CardContentContextMenu({
  data,
}: ICardContentContextMenu): ReactElement {
  const { removeContextMenu } = useContextMenu();
  const router = useRouter();
  const { addToast } = useToast();

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
      {isSaveable && (
        <li>
          <button
            type="button"
            onClick={() => {
              saveFunction(data.type as SaveFunctionTypes, data.id);
              addToast({
                message: `${capitalizeFirstLetter(
                  data.type || "track"
                )} added to your library`,
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
