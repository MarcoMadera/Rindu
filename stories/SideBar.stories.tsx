import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof SideBar>;

const Template: ComponentStory<typeof SideBar> = () => {
  return <SideBar />;
};

export const Default = Template.bind({});
