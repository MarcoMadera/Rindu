import { Meta } from "@storybook/react";

import { PageHeader } from "components";
import { HeaderType } from "types/pageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
    container: {
      disablePadding: true,
    },
  },
  argTypes: {
    title: { control: "text" },
    type: {
      options: Object.values(HeaderType),
      control: { type: "select" },
    },
  },
};
export default meta;

export const Playlist = {
  args: {
    type: HeaderType.Playlist,
    title: "Heartstopper: Official Mixtape",
    coverImg:
      "https://th.bing.com/th/id/OIP.3vYK8ab9Pg3FiufY8UgZOwHaHa?pid=ImgDet&rs=1",
    description:
      "The official playlist for Heartstopper. Watch now on Netflix!",
    ownerDisplayName: "Heartstopper",
    ownerId: "1",
    totalFollowers: 100,
    totalTracks: 10,
  },
};

export const Artist = {
  args: {
    type: HeaderType.Artist,
    title: "Billie Eilish",
    coverImg:
      "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
    totalFollowers: 100,
    popularity: 80,
    disableOpacityChange: true,
  },
};

export const ArtistWithBanner = {
  args: {
    type: HeaderType.Artist,
    title: "Billie Eilish",
    coverImg:
      "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
    totalFollowers: 100,
    popularity: 80,
    banner:
      "https://www.theaudiodb.com/images/media/artist/fanart/qqwxxp1542730121.jpg",
    disableOpacityChange: true,
  },
};

export const Episode = {
  args: {
    type: HeaderType.Episode,
    title: "Shadow Work Demystified",
    coverImg:
      "https://i.scdn.co/image/ab6765630000ba8adea5d4cd16f16977604725eb",
    ownerId: "2OLNxlrm2OCdATbUaonmEh",
    ownerDisplayName: "Skinny Dipping",
  },
};
