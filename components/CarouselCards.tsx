import { ReactElement } from "react";

import { CardType } from "./CardContent";
import Carousel from "./Carousel";
import PresentationCard from "./PresentationCard";
import { CardSubTitle } from "components";

export function CarouselCards({
  items,
  translations,
  title,
  type,
}: {
  items: SpotifyApi.AlbumObjectSimplified[] | SpotifyApi.ArtistObjectFull[];
  translations: Record<string, string>;
  title: string;
  type: CardType;
}): ReactElement {
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
            subTitle={
              <CardSubTitle
                type={type}
                item={item}
                translations={translations}
              />
            }
            id={item.id}
          />
        );
      })}
    </Carousel>
  );
}
