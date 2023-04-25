import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { Logo } from "components";

export default {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Logo>;

const Template: StoryFn<typeof Logo> = (args) => {
  return <Logo {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  color: "#000",
};
