import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { track } from "./mocks";
import { FirstTrackContainer } from "components";

export default {
  title: "Components/FirstTrackContainer",
  component: FirstTrackContainer,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof FirstTrackContainer>;

const Template: ComponentStory<typeof FirstTrackContainer> = (args) => {
  return <FirstTrackContainer {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  track: track,
  backgroundColor: "rgba(171, 202, 165, 0.9)",
  position: 0,
};
