import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { CardSubTitle } from "components";
import { CardType } from "components/CardContent";
import { albumFull } from "utils/__tests__/__mocks__/mocks";

export default {
  title: "Components/CardSubTitle",
  component: CardSubTitle,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
} as Meta<typeof CardSubTitle>;

const Template: StoryFn<typeof CardSubTitle> = (args) => (
  <CardSubTitle {...args} />
);

export const Default = Template.bind({});
Default.args = {
  item: albumFull,
  type: CardType.ALBUM,
};
