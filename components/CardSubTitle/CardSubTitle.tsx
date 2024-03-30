import { ReactNode } from "react";

import { SubTitle } from "components";
import { CardType } from "components/CardContent";
import { useTranslations } from "hooks";
import { IMappedAlbumItems } from "pages/artist/[artistId]";

interface ICardSubTitle {
  type: CardType;
  item: IMappedAlbumItems | SpotifyApi.ArtistObjectFull;
}

export default function CardSubTitle({
  type,
  item,
}: Readonly<ICardSubTitle>): ReactNode {
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
    return translations.contentType.artist;
  }

  return null;
}
