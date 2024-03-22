import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { track } from "../mocks";
import { FirstTrackContainer } from "components";

export default {
  title: "Components/FirstTrackContainer",
  component: FirstTrackContainer,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof FirstTrackContainer>;

const Template: StoryFn<typeof FirstTrackContainer> = (args) => {
  return <FirstTrackContainer {...args} />;
};

export const Default = {
  render: Template,

  args: {
    track: track,
    backgroundColor: "rgba(171, 202, 165, 0.9)",
    position: 0,
  },
};
