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
      disablePadding: true,
    },
  },
} as Meta<typeof TrackListHeader>;

const Template: StoryFn<typeof TrackListHeader> = (args) => {
  return <TrackListHeader {...args} />;
};

export const Album = {
  render: Template,

  args: {
    type: CardType.Album,
    isPin: true,
    setIsPin: (): void => {
      console.info("pin clicked");
    },
  },
};

export const Playlist = {
  render: Template,

  args: {
    type: CardType.Playlist,
    isPin: true,
    setIsPin: (): void => {
      console.info("pin");
    },
  },
};

export const Presentation = {
  render: Template,

  args: {
    type: CardType.Presentation,
    isPin: true,
    setIsPin: (): void => {
      console.info("pin");
    },
  },
};
