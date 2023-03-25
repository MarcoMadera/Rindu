import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof SpotifyPlayer>;

const Template: ComponentStory<typeof SpotifyPlayer> = () => <SpotifyPlayer />;

export const Default = Template.bind({});
