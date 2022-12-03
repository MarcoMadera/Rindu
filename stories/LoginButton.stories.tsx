import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import LoginButton from "../components/LoginButton";

export default {
  title: "Components/LoginButton",
  component: LoginButton,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof LoginButton>;

const Template: ComponentStory<typeof LoginButton> = () => {
  return (
    <div
      style={{
        padding: "2em",
        background: "rgba(0, 0, 0, 0.9)",
      }}
    >
      <LoginButton />
    </div>
  );
};

export const Default = Template.bind({});
