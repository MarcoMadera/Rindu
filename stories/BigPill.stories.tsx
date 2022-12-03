import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import BigPill from "../components/BigPill";

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
} as ComponentMeta<typeof BigPill>;

const Template: ComponentStory<typeof BigPill> = (args) => (
  <div
    style={{
      margin: "2em",
      background: "#121212",
      minHeight: "180px",
      padding: "30px",
    }}
  >
    <BigPill {...args} />
  </div>
);

export const Artist = Template;
Artist.args = {
  img: "https://studiosol-a.akamaihd.net/uploadfile/letras/fotos/6/1/c/a/61ca1dcbc2cdda2af430927f4fe4b98c.jpg",
  title: "Artist",
  subTitle: "Billie Eilish",
  href: "/artist/1",
};
