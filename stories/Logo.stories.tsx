import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import UserContext, { IUserContext } from "context/UserContext";
import Logo from "../components/Logo";
import { withKnobs, boolean } from "@storybook/addon-knobs";

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

export const Default = Template;
Default.args = {
  color: "#000",
};
