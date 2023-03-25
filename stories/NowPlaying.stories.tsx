import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof NowPlaying>;

const Template: ComponentStory<typeof NowPlaying> = () => {
  return <NowPlaying />;
};

export const Default = Template.bind({});
