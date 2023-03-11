import {
  getSiteUrl,
  TOP_TRACKS_LONG_TERM_COLOR,
  TOP_TRACKS_MEDIUM_TERM_COLOR,
  TOP_TRACKS_SHORT_TERM_COLOR,
} from "utils";

interface TopTracksCard {
  name: string;
  images: { url: string }[];
  id: string;
  subTitle: string;
  url: string;
}

export function getTopTracksCards(
  user: SpotifyApi.UserObjectPrivate | null,
  translations: Record<string, string>
): TopTracksCard[] {
  return [
    {
      name: translations.topTracksPlaylistLongTermTitle,
      images: [
        {
          url: `${getSiteUrl()}/api/top-tracks-cover?title=${
            translations.topTracksPlaylistLongTermTitle
          }&color=${TOP_TRACKS_LONG_TERM_COLOR}&imageUrl=${
            user?.images?.[0]?.url || ""
          }`,
        },
      ],
      id: "top-tracks",
      subTitle: "",
      url: "/top/tracks-long-term",
    },
    {
      name: translations.topTracksPlaylistMediumTermTitle,
      images: [
        {
          url: `${getSiteUrl()}/api/top-tracks-cover?title=${
            translations.topTracksPlaylistMediumTermTitle
          }&color=${TOP_TRACKS_MEDIUM_TERM_COLOR}&imageUrl=${
            user?.images?.[0]?.url || ""
          }`,
        },
      ],
      id: "top-tracks",
      subTitle: "",
      url: "/top/tracks-medium-term",
    },
    {
      name: translations.topTracksPlaylistShortTermTitle,
      images: [
        {
          url: `${getSiteUrl()}/api/top-tracks-cover?title=${
            translations.topTracksPlaylistShortTermTitle
          }&color=${TOP_TRACKS_SHORT_TERM_COLOR}&imageUrl=${
            user?.images?.[0]?.url || ""
          }`,
        },
      ],
      id: "top-tracks",
      subTitle: "",
      url: "/top/tracks-short-term",
    },
  ];
}
