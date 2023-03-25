import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Logo } from "components";

export default {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => {
  return <Logo {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  color: "#000",
};
