import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof TrackListHeader>;

const Template: ComponentStory<typeof TrackListHeader> = (args) => {
  return <TrackListHeader {...args} />;
};

export const Album = Template.bind({});
Album.args = {
  type: CardType.album,
  isPin: true,
  setIsPin: () => {
    console.info("pin clicked");
  },
};

export const Playlist = Template.bind({});
Playlist.args = {
  type: CardType.playlist,
  isPin: true,
  setIsPin: () => {
    console.info("pin");
  },
};

export const Presentation = Template.bind({});
Presentation.args = {
  type: CardType.presentation,
  isPin: true,
  setIsPin: () => {
    console.info("pin");
  },
};
