import { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

import { ArtistList } from "components";
import { wait } from "utils";
import { artist } from "utils/__tests__/__mocks__/mocks";

type Story = StoryObj<typeof ArtistList>;

export default {
  title: "Components/ArtistList",
  component: ArtistList,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
    argTypes: {
      maxArtistsToShow: { control: "number" },
    },
  },
} as Meta<typeof ArtistList>;

export const Default: Story = {
  args: {
    artists: [artist, artist, artist, artist, artist, artist],
    maxArtistsToShow: 3,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const links = canvas.getAllByRole("link", { hidden: true });

    links.reduce(async (acc, link): Promise<void> => {
      await acc;
      await userEvent.click(link);
      expect(link).toHaveFocus();
      await wait(500);
    }, Promise.resolve());
  },
};
