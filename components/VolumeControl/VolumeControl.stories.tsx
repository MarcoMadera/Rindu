import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { VolumeControl } from "components";
export default {
  title: "Components/VolumeControl",
  component: VolumeControl,
  parameters: {
    layout: "fullscreen",
    container: {
      style: {
        maxWidth: "400px",
        display: "flex",
        alignItems: "center",
      },
    },
  },
} as Meta<typeof VolumeControl>;

const Template: StoryFn<typeof VolumeControl> = () => <VolumeControl />;

export const Default = {
  render: Template,
};
