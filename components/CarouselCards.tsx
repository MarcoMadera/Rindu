import { ReactElement } from "react";

import { CardType } from "./CardContent";
import Carousel from "./Carousel";
import PresentationCard from "./PresentationCard";
import { CardSubTitle } from "components";
import { IMappedAlbums } from "pages/artist/[artistId]";

interface ICarouselCards {
  items: IMappedAlbums["items"] | SpotifyApi.ArtistObjectFull[];
  title: string;
  type: CardType;
}

export function CarouselCards({
  items,
  title,
  type,
}: ICarouselCards): ReactElement {
  return (
    <Carousel title={title} gap={24}>
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
