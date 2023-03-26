import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof ShortCuts>;

const Template: ComponentStory<typeof ShortCuts> = () => {
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

export const Default = Template.bind({});
