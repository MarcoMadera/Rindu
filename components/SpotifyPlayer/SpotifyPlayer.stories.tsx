import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { SpotifyPlayer } from "components";
export default {
  title: "Components/SpotifyPlayer",
  component: SpotifyPlayer,
  parameters: {
    layout: "fullscreen",
    container: {
      disablePadding: true,
    },
  },
} as Meta<typeof SpotifyPlayer>;

const Template: StoryFn<typeof SpotifyPlayer> = () => <SpotifyPlayer />;

export const Default = {
  render: Template,
};
