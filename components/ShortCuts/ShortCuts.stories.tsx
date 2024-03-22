import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { ModalContainer, ShortCuts } from "components";
export default {
  title: "Components/ShortCuts",
  component: ShortCuts,
  parameters: {
    layout: "fullscreen",
    container: {
      width: "100%",
      disablePadding: true,
    },
  },
} as Meta<typeof ShortCuts>;

const Template: StoryFn<typeof ShortCuts> = () => {
  return (
    <ModalContainer
      title="Details"
      setModalData={() => {
        console.info("setModalData");
      }}
      minWidth="600px"
    >
      <ShortCuts />
    </ModalContainer>
  );
};

export const Default = {
  render: Template,
};
