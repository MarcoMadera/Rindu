import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { RouterButtons } from "components";

export default {
  title: "Components/RouterButtons",
  component: RouterButtons,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
      disablePadding: true,
    },
  },
} as ComponentMeta<typeof RouterButtons>;

const Template: ComponentStory<typeof RouterButtons> = () => {
  return (
    <div
      style={{
        padding: "2em",
      }}
    >
      <RouterButtons />
    </div>
  );
};

export const Default = Template.bind({});
