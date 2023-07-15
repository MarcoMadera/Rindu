import React from "react";

import { Meta, StoryFn } from "@storybook/react";

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
} as Meta<typeof ProgressBar>;

const Template: StoryFn<typeof ProgressBar> = () => {
  return <ProgressBar />;
};

export const Default = Template.bind({});
