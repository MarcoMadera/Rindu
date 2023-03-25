import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { EditPlaylistDetails, ModalContainer } from "components";
export default {
  title: "Components/EditPlaylistDetails",
  component: EditPlaylistDetails,
  parameters: {
    layout: "fullscreen",
    container: {
      disablePadding: true,
    },
  },
} as ComponentMeta<typeof EditPlaylistDetails>;

const Template: ComponentStory<typeof EditPlaylistDetails> = (args) => {
  return (
    <ModalContainer
      title="Edit details"
      setModalData={() => {
        console.log("setModalData");
      }}
      minWidth="600px"
      maxHeight="100%"
    >
      <EditPlaylistDetails {...args} />
    </ModalContainer>
  );
};

export const Default = Template.bind({});
Default.args = {
  id: "37i9dQZF1DXcBWIGoYBM5M",
  coverImg: "https://i.scdn.co/image/ab67706c0000bebb42d9a147c58fb9d695c1768b",
  description: "A playlist description",
  name: "A playlist name",
};
