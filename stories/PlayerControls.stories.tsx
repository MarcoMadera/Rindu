import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PlayerControls } from "components";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ToastContextProvider } from "context/ToastContext";
import { UserContextProvider } from "context/UserContext";
export default {
  title: "Components/PlayerControls",
  component: PlayerControls,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof PlayerControls>;

const Template: ComponentStory<typeof PlayerControls> = () => (
  <ToastContextProvider>
    <UserContextProvider>
      <HeaderContextProvider>
        <SpotifyContextProvider>
          <ContextMenuContextProvider>
            <div
              style={{
                padding: "2em",
                background: "rgba(0, 0, 0, 0.9)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <PlayerControls />
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
