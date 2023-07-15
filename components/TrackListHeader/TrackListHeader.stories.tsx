import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { TrackListHeader } from "components";
import { CardType } from "components/CardTrack";

export default {
  title: "Components/TrackListHeader",
  component: TrackListHeader,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
      disablePadding: true,
    },
  },
} as Meta<typeof TrackListHeader>;

const Template: StoryFn<typeof TrackListHeader> = (args) => {
  return <TrackListHeader {...args} />;
};

export const Album = Template.bind({});
Album.args = {
  type: CardType.Album,
  isPin: true,
  setIsPin: () => {
    console.info("pin clicked");
  },
};

export const Playlist = Template.bind({});
Playlist.args = {
  type: CardType.Playlist,
  isPin: true,
  setIsPin: () => {
    console.info("pin");
  },
};

export const Presentation = Template.bind({});
Presentation.args = {
  type: CardType.Presentation,
  isPin: true,
  setIsPin: () => {
    console.info("pin");
  },
};
