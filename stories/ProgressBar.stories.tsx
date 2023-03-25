import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { ProgressBar } from "components";
export default {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
      style: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
      },
    },
  },
} as ComponentMeta<typeof ProgressBar>;

const Template: ComponentStory<typeof ProgressBar> = () => {
  return <ProgressBar />;
};

export const Default = Template.bind({});
