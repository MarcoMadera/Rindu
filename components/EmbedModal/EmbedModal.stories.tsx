import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { EmbedModal, ModalContainer } from "components";
export default {
  title: "Components/EmbedModal",
  component: EmbedModal,
  parameters: {
    layout: "fullscreen",
    container: {
      disablePadding: true,
    },
  },
} as Meta<typeof EmbedModal>;

const Template: StoryFn<typeof EmbedModal> = (args) => {
  return (
    <ModalContainer
      title="Details"
      setModalData={() => {
        console.info("setModalData");
      }}
      minWidth="600px"
      maxHeight="100%"
    >
      <EmbedModal {...args} />
    </ModalContainer>
  );
};

export const Playlist = Template.bind({});
Playlist.args = {
  type: "playlist",
  id: "37i9dQZF1DXcBWIGoYBM5M",
};

export const Artist = Template.bind({});
Artist.args = {
  type: "artist",
  id: "0OdUWJ0sBjDrqHygGUXeCF",
};

export const Album = Template.bind({});
Album.args = {
  type: "album",
  id: "0JGOiO34nwfUdDrD612dOp",
};

export const Track = Template.bind({});
Track.args = {
  type: "track",
  id: "0yLdNVWF3Srea0uzk55zFn",
};

export const Show = Template.bind({});
Show.args = {
  type: "show",
  id: "4rOoJ6Egrf8K2IrywzwOMk",
};

export const Episode = Template.bind({});
Episode.args = {
  type: "episode",
  id: "4JrMUkxnLuYOlWNuV6y5a4",
};
