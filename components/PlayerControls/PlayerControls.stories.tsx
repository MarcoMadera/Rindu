import React from "react";

import { Meta, StoryFn } from "@storybook/react";

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
} as Meta<typeof PlayerControls>;

const Template: StoryFn<typeof PlayerControls> = () => <PlayerControls />;

export const Default = {
  render: Template,

  args: {
    size: 40,
    centerSize: 20,
  },
};
