import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { SideBar } from "components";
export default {
  title: "Components/SideBar",
  component: SideBar,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
      disablePadding: true,
      style: {
        maxWidth: "300px",
      },
    },
  },
} as Meta<typeof SideBar>;

const Template: StoryFn<typeof SideBar> = () => {
  return <SideBar />;
};

export const Default = Template.bind({});
