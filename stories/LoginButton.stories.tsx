import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { LoginButton } from "components";

export default {
  title: "Components/LoginButton",
  component: LoginButton,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof LoginButton>;

const Template: ComponentStory<typeof LoginButton> = () => {
  return <LoginButton />;
};

export const Default = Template.bind({});
