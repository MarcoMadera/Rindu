import { ReactElement } from "react";

import { CardType } from "./CardContent";
import SubTitle from "./SubTitle";
import { IMappedAlbumItems } from "pages/artist/[artistId]";

interface ICardSubTitle {
  type: CardType;
  item: IMappedAlbumItems | SpotifyApi.ArtistObjectFull;
  translations: Record<string, string>;
}

export function CardSubTitle({
  type,
  item,
  translations,
}: ICardSubTitle): ReactElement {
  if (type === CardType.ALBUM && "album_type" in item) {
    return (
      <SubTitle
        artists={item.artists}
        albumType={item.album_type}
        releaseYear={item.release_date}
      />
    );
  }

  if (type === CardType.ARTIST) {
    return <>{translations.artist}</>;
  }

  return <></>;
}
