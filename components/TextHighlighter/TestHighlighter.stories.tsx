import type { Meta as MetaObj, StoryObj } from "@storybook/react";

import { TextHighlighter } from "components";

export default {
  title: "Design System/Code",
  parameters: {
    layout: "fullscreen",
  },
} as MetaObj;

export const Highlighted: StoryObj = {
  render: () => (
    <main>
      <TextHighlighter text="highlighted text">
        This is an example of highlighted text
      </TextHighlighter>
    </main>
  ),
};
