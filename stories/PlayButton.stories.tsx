import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { PlayButton } from "../components/PlayButton";
import { UserContextProvider } from "context/UserContext";
import { ToastContextProvider } from "context/ToastContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
export default {
  title: "Components/PlayButton",
  component: PlayButton,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof PlayButton>;

const Template: ComponentStory<typeof PlayButton> = (args) => (
  <ToastContextProvider>
    <UserContextProvider>
      <HeaderContextProvider>
        <SpotifyContextProvider>
          <ContextMenuContextProvider>
            <div
              style={{
                padding: "2em",
                background: "rgba(0, 0, 0, 0.9)",
              }}
            >
              <PlayButton {...args} />
            </div>
          </ContextMenuContextProvider>
        </SpotifyContextProvider>
      </HeaderContextProvider>
    </UserContextProvider>
  </ToastContextProvider>
);

export const Default = Template.bind({});
Default.args = {
  size: 40,
  centerSize: 20,
};
