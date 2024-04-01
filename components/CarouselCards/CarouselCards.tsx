import { ReactElement } from "react";

import { CardSubTitle, Carousel, PresentationCard } from "components";
import { CardType } from "components/CardContent";
import { useOnSmallScreen } from "hooks";
import { IMappedAlbums } from "pages/artist/[artistId]";

interface ICarouselCards {
  items: IMappedAlbums["items"] | SpotifyApi.ArtistObjectFull[];
  title: string;
  type: CardType;
}

export default function CarouselCards({
  items,
  title,
  type,
}: Readonly<ICarouselCards>): ReactElement {
  const isSmallScreen = useOnSmallScreen();
  return (
    <Carousel title={title} gap={isSmallScreen ? 8 : 24}>
      {items?.map((item) => {
        if (!item) return null;

        return (
          <PresentationCard
            type={type}
            key={item.id}
            images={item.images}
            title={item.name}
            subTitle={<CardSubTitle type={type} item={item} />}
            id={item.id}
          />
        );
      })}
    </Carousel>
  );
}
