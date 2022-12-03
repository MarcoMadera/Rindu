import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import RouterButtons from "../components/RouterButtons";
import { withKnobs } from "@storybook/addon-knobs";

export default {
  title: "Components/RouterButtons",
  component: RouterButtons,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
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

export const Default = Template;
