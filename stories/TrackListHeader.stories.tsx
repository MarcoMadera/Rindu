import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import TrackListHeader from "../components/TrackListHeader";

export default {
  title: "Components/TrackListHeader",
  component: TrackListHeader,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof TrackListHeader>;

const Template: ComponentStory<typeof TrackListHeader> = (args) => {
  return <TrackListHeader {...args} />;
};

export const Album = Template.bind({});
Album.args = {
  type: "album",
  isPin: true,
  setIsPin: () => {
    console.log("pin clicked");
  },
};

export const Playlist = Template.bind({});
Playlist.args = {
  type: "playlist",
  isPin: true,
  setIsPin: () => {
    console.log("pin");
  },
};

export const Presentation = Template.bind({});
Presentation.args = {
  type: "presentation",
  isPin: true,
  setIsPin: () => {
    console.log("pin");
  },
};
