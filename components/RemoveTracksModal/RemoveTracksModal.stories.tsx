import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { ModalContainer, RemoveTracksModal } from "components";
export default {
  title: "Components/RemoveTracksModal",
  component: RemoveTracksModal,
  parameters: {
    layout: "fullscreen",
    container: {
      width: "100%",
      disablePadding: true,
    },
  },
} as Meta<typeof RemoveTracksModal>;

const Template: StoryFn<typeof RemoveTracksModal> = (args) => {
  return (
    <ModalContainer
      title="Details"
      setModalData={() => {
        console.info("setModalData");
      }}
      minWidth="600px"
    >
      <RemoveTracksModal {...args} />
    </ModalContainer>
  );
};

export const Default = {
  render: Template,

  args: {
    isLibrary: true,
  },
};
