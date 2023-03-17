import { CardType } from "components/CardContent";

export function getCarouselItems(
  type: CardType,
  items:
    | SpotifyApi.ArtistsAlbumsResponse
    | SpotifyApi.ArtistsRelatedArtistsResponse
): SpotifyApi.AlbumObjectSimplified[] | SpotifyApi.ArtistObjectFull[] {
  if (!items) return [];

  if (type === CardType.ALBUM && "items" in items) {
    return items.items;
  }

  if (type === CardType.ARTIST && "artists" in items) {
    return items.artists;
  }
  return [];
}
