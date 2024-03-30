import { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";

import { BigPill } from "components";

type Story = StoryObj<typeof BigPill>;

export default {
  title: "Components/BigPill",
  component: BigPill,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    title: { control: "text" },
    img: { control: "text" },
    href: { control: "text" },
    subTitle: { control: "text", type: "string" },
  },
} as Meta<typeof BigPill>;

export const Artist: Story = {
  args: {
    img: "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
    title: "Artist",
    subTitle: "Billie Eilish",
    href: "/artist/1",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const artistLink = canvas.getByRole("link");

    await userEvent.click(artistLink);

    expect(artistLink).toHaveAttribute("href");

    expect(artistLink).toHaveFocus();
  },
};
