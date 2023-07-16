import React from "react";

import { Meta, StoryFn } from "@storybook/react";

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

const Template: StoryFn<typeof CardContentContextMenu> = (args) => (
  <CardContentContextMenu {...args} />
);

export const Playlist = Template.bind({});
Playlist.args = {
  data: { type: CardType.PLAYLIST, id: "123", uri: "Cn6bmU93JpPx" },
};
export const Album = Template.bind({});
Album.args = {
  data: { type: CardType.ALBUM, id: "123", uri: "Cn6bmU93JpPx" },
};
export const Artist = Template.bind({});
Artist.args = {
  data: { type: CardType.ARTIST, id: "123", uri: "Cn6bmU93JpPx" },
};
export const Episode = Template.bind({});
Episode.args = {
  data: { type: CardType.EPISODE, id: "123", uri: "Cn6bmU93JpPx" },
};
export const Genre = Template.bind({});
Genre.args = {
  data: { type: CardType.GENRE, id: "123", uri: "Cn6bmU93JpPx" },
};
export const Show = Template.bind({});
Show.args = {
  data: { type: CardType.SHOW, id: "123", uri: "Cn6bmU93JpPx" },
};
export const Track = Template.bind({});
Track.args = {
  data: { type: CardType.TRACK, id: "123", uri: "Cn6bmU93JpPx" },
};
export const User = Template.bind({});
User.args = {
  data: { type: CardType.USER, id: "123", uri: "Cn6bmU93JpPx" },
};
export const Ad = Template.bind({});
Ad.args = {
  data: { type: CardType.AD, id: "123", uri: "Cn6bmU93JpPx" },
};
