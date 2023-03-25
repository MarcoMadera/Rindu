import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PlayButton } from "components";

export default {
  title: "Components/PlayButton",
  component: PlayButton,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof PlayButton>;

const Template: ComponentStory<typeof PlayButton> = (args) => (
  <PlayButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  size: 40,
  centerSize: 20,
};
