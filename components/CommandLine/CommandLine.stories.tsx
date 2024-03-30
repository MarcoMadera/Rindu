import { Meta, StoryObj } from "@storybook/react";

import { CommandLine as CommandLineComponent } from "components";

type Story = StoryObj<typeof CommandLineComponent>;

export default {
  title: "Design System/Code",
  component: CommandLineComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof CommandLineComponent>;

export const CommandLine: Story = {
  args: {},
};
