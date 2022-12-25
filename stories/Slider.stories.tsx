import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Slider from "../components/Slider";

export default {
  title: "Components/Slider",
  component: Slider,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Slider>;

const Template: ComponentStory<typeof Slider> = (args) => {
  return (
    <div
      style={{
        padding: "2em",
        background: "rgba(0, 0, 0, 0.9)",
      }}
    >
      <Slider {...args} />
    </div>
  );
};

export const WithUpdate = Template.bind({});
WithUpdate.args = {
  title: "Interval slider",
  updateProgress: 1,
  intervalUpdateAction: {
    steps: 100 / 12,
    labelUpdateValue: 1,
    ms: 1000,
    shouldUpdate: true,
  },
  onDragging: (isDragging) => {
    console.log("draggin", isDragging);
  },
  setLabelValue: (value) => {
    console.log("label", value);
  },
  valueText: "value",
  initialValuePercent: 0,
  action: (progressPercent) => {
    console.log("progressPercent", progressPercent);
  },
};

export const Static = Template.bind({});
Static.args = {
  title: "Static Slider",
  setLabelValue: (value) => {
    console.log("label", value);
  },
  valueText: "value",
  initialValuePercent: 0,
  action: (progressPercent) => {
    console.log("progressPercent", progressPercent);
  },
};
