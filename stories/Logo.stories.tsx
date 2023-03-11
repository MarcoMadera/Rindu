import React from "react";

import { boolean, withKnobs } from "@storybook/addon-knobs";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Logo } from "components";
import UserContext, { IUserContext } from "context/UserContext";

export default {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => {
  return (
    <div
      style={{
        padding: "2em",
      }}
    >
      <UserContext.Provider
        value={{ isLogin: boolean("isLogin", true) } as IUserContext}
      >
        <Logo {...args} />
      </UserContext.Provider>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  color: "#000",
};
