import { CardType } from "components/CardContent";
import { IMappedAlbums } from "pages/artist/[artistId]";

export function getCarouselItems(
  type: CardType,
  items: IMappedAlbums | SpotifyApi.ArtistsRelatedArtistsResponse
): IMappedAlbums["items"] | SpotifyApi.ArtistObjectFull[] {
  if (!items) return [];

  if (type === "album" && "items" in items) {
    return items.items;
  }

  if (type === "artist" && "artists" in items) {
    return items.artists;
  }
  return [];
}
