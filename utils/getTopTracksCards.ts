import { ITranslations } from "types/translations";
import {
  DEFAULT_SONG_IMAGE_URL,
  GeneratedImageAPI,
  getGeneratedImageUrl,
  TOP_TRACKS_LONG_TERM_COLOR,
  TOP_TRACKS_MEDIUM_TERM_COLOR,
  TOP_TRACKS_SHORT_TERM_COLOR,
} from "utils";

interface TopTracksCard {
  name: string;
  images: { url: string }[];
  url: string;
}

export function getTopTracksCards(
  user: SpotifyApi.UserObjectPrivate | null | undefined,
  translations: ITranslations
): TopTracksCard[] {
  if (!user) {
    return [];
  }

  const CARDS: { name: string; color: string; url: string }[] = [
    {
      name: translations.pages.dashboard.topTracksPlaylistLongTermTitle,
      color: TOP_TRACKS_LONG_TERM_COLOR,
      url: "/top/tracks-long-term",
    },
    {
      name: translations.pages.dashboard.topTracksPlaylistMediumTermTitle,
      color: TOP_TRACKS_MEDIUM_TERM_COLOR,
      url: "/top/tracks-medium-term",
    },
    {
      name: translations.pages.dashboard.topTracksPlaylistShortTermTitle,
      color: TOP_TRACKS_SHORT_TERM_COLOR,
      url: "/top/tracks-short-term",
    },
  ];

  const topTracksCards = CARDS.map((card) => {
    const params = {
      title: card.name,
      color: card.color,
      imageUrl: user?.images?.[0]?.url ?? DEFAULT_SONG_IMAGE_URL,
    };
    const generatedImageUrl = getGeneratedImageUrl(
      GeneratedImageAPI.TopTracksCover,
      params
    );

    return {
      name: card.name,
      images: [{ url: generatedImageUrl }],
      url: card.url,
    };
  });

  return topTracksCards;
}
