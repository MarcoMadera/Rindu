import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { track } from "./mocks";
import { NowPlaying } from "components";

export default {
  title: "Components/NowPlaying",
  component: NowPlaying,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
    spotifyValue: {
      currentlyPlaying: track,
      isPlaying: true,
    },
  },
} as Meta<typeof NowPlaying>;

const Template: StoryFn<typeof NowPlaying> = () => {
  return <NowPlaying />;
};

export const Default = Template.bind({});
