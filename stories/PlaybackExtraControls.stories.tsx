import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { PlaybackExtraControls } from "components";
export default {
  title: "Components/PlaybackExtraControls",
  component: PlaybackExtraControls,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
} as Meta<typeof PlaybackExtraControls>;

const Template: StoryFn<typeof PlaybackExtraControls> = () => {
  return <PlaybackExtraControls />;
};

export const Default = Template.bind({});
