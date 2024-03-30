import { Meta } from "@storybook/react";

import { CardSubTitle } from "components";
import { CardType } from "components/CardContent";
import { albumFull } from "utils/__tests__/__mocks__/mocks";

export default {
  title: "Components/CardSubTitle",
  component: CardSubTitle,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof CardSubTitle>;

export const Default = {
  args: {
    item: albumFull,
    type: CardType.ALBUM,
  },
};
