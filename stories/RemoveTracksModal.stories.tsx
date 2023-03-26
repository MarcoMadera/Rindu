import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof RemoveTracksModal>;

const Template: ComponentStory<typeof RemoveTracksModal> = (args) => {
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

export const Default = Template.bind({});
Default.args = {
  isLibrary: true,
};
