import React, { ComponentProps, ReactElement } from "react";

import { Meta, StoryFn } from "@storybook/react";

import { BrowseCategories } from "components";
import { paginObject } from "utils/__tests__/__mocks__/mocks";

export default {
  title: "Components/BrowseCategories",
  component: BrowseCategories,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
    argTypes: {
      totalCategories: { control: "number" },
    },
  },
} as Meta<typeof BrowseCategories>;

const getCategories = (number: number) => ({
  ...paginObject,
  items: Array.from({ length: number }).map((_, i) => ({
    name: `category${i}`,
    id: `${i}`,
    href: `test-${i}`,
    icons: [
      {
        url: `https://picsum.photos/400/400?random=${i}`,
      },
    ],
  })),
});

const Template: StoryFn<
  ({
    totalCategories,
    ...args
  }: { totalCategories: number } & ComponentProps<
    typeof BrowseCategories
  >) => ReactElement
> = (args) => (
  <BrowseCategories categories={getCategories(args.totalCategories)} />
);

export const Default = Template.bind({});
Default.args = {
  totalCategories: 30,
};
