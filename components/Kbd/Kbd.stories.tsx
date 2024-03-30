import { Meta, StoryObj } from "@storybook/react";

import { Kbd, Paragraph } from "components";

type Story = StoryObj<typeof Kbd>;

export default {
  title: "Design System/Code",
  component: Kbd,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof Kbd>;

export const ShortCut: Story = {
  render: () => {
    return (
      <Paragraph>
        Create new playlist
        <Kbd>Alt</Kbd> + <Kbd>Shift</Kbd> + <Kbd>P</Kbd>
      </Paragraph>
    );
  },
};
