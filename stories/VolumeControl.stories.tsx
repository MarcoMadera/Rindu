import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { VolumeControl } from "components";
export default {
  title: "Components/VolumeControl",
  component: VolumeControl,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
      style: {
        maxWidth: "400px",
        display: "flex",
        alignItems: "center",
      },
    },
  },
} as ComponentMeta<typeof VolumeControl>;

const Template: ComponentStory<typeof VolumeControl> = () => <VolumeControl />;

export const Default = Template.bind({});
