import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PlayerControls } from "components";

export default {
  title: "Components/PlayerControls",
  component: PlayerControls,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
    },
  },
} as ComponentMeta<typeof PlayerControls>;

const Template: ComponentStory<typeof PlayerControls> = () => (
  <PlayerControls />
);

export const Default = Template.bind({});
Default.args = {
  size: 40,
  centerSize: 20,
};
