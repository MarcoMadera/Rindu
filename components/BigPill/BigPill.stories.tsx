import { Meta } from "@storybook/react";

import { BigPill } from "components";

export default {
  title: "Components/BigPill",
  component: BigPill,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
  argTypes: {
    title: { control: "text" },
    img: { control: "text" },
    href: { control: "text" },
    subTitle: { control: "text", type: "string" },
  },
} as Meta<typeof BigPill>;

export const Artist = {
  args: {
    img: "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
    title: "Artist",
    subTitle: "Billie Eilish",
    href: "/artist/1",
  },
};
