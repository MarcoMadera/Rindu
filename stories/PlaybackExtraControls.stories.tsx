import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof PlaybackExtraControls>;

const Template: ComponentStory<typeof PlaybackExtraControls> = () => {
  return <PlaybackExtraControls />;
};

export const Default = Template.bind({});
