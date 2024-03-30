import type { Meta as MetaObj, StoryObj } from "@storybook/react";

import { Code, Paragraph } from "components";

export default {
  title: "Design System/Code",
  parameters: {
    layout: "fullscreen",
  },
} as MetaObj;

export const InlineCode: StoryObj = {
  render: () => (
    <main>
      <Paragraph>
        This is an example of <Code>inline code block</Code>
      </Paragraph>
    </main>
  ),
};
