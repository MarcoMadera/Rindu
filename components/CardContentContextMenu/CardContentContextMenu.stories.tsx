import { Meta } from "@storybook/react";

import { CardContentContextMenu } from "components";
import { CardType } from "components/CardContent/CardContent";

export default {
  title: "Components/CardContentContextMenu",
  component: CardContentContextMenu,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
} as Meta<typeof CardContentContextMenu>;

export const Playlist = {
  args: {
    data: { type: CardType.PLAYLIST, id: "123", uri: "Cn6bmU93JpPx" },
  },
};

export const Album = {
  args: {
    data: { type: CardType.ALBUM, id: "123", uri: "Cn6bmU93JpPx" },
  },
};

export const Artist = {
  args: {
    data: { type: CardType.ARTIST, id: "123", uri: "Cn6bmU93JpPx" },
  },
};

export const Episode = {
  args: {
    data: { type: CardType.EPISODE, id: "123", uri: "Cn6bmU93JpPx" },
  },
};

export const Genre = {
  args: {
    data: { type: CardType.GENRE, id: "123", uri: "Cn6bmU93JpPx" },
  },
};

export const Show = {
  args: {
    data: { type: CardType.SHOW, id: "123", uri: "Cn6bmU93JpPx" },
  },
};

export const Track = {
  args: {
    data: { type: CardType.TRACK, id: "123", uri: "Cn6bmU93JpPx" },
  },
};

export const User = {
  args: {
    data: { type: CardType.USER, id: "123", uri: "Cn6bmU93JpPx" },
  },
};

export const Ad = {
  args: {
    data: { type: CardType.AD, id: "123", uri: "Cn6bmU93JpPx" },
  },
};
