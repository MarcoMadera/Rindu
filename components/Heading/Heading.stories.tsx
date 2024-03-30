import type { Meta as MetaObj, StoryObj } from "@storybook/react";

import { Heading } from "components";

export default {
  title: "Design System/Headings",
  component: Heading,
  parameters: {
    layout: "fullscreen",
  },
} as MetaObj;

export const Heading1: StoryObj = {
  args: {
    children: "Heading 1",
    number: 1,
  },
};

export const Heading2: StoryObj = {
  args: {
    children: "Heading 2",
    number: 2,
  },
};

export const Heading3: StoryObj = {
  args: {
    children: "Heading 3",
    number: 3,
  },
};

export const Heading4: StoryObj = {
  args: {
    children: "Heading 4",
    number: 4,
  },
};

export const Heading5: StoryObj = {
  args: {
    children: "Heading 5",
    number: 5,
  },
};

export const Heading6: StoryObj = {
  args: {
    children: "Heading 6",
    number: 6,
  },
};
