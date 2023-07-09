import { ReactElement } from "react";

import { CardType } from "./CardContent";
import SubTitle from "./SubTitle";
import { useTranslations } from "hooks";
import { IMappedAlbumItems } from "pages/artist/[artistId]";

interface ICardSubTitle {
  type: CardType;
  item: IMappedAlbumItems | SpotifyApi.ArtistObjectFull;
}

export function CardSubTitle({ type, item }: ICardSubTitle): ReactElement {
  const { translations } = useTranslations();

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
