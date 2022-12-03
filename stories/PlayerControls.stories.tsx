import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import PlayerControls from "../components/PlayerControls";
import { UserContextProvider } from "context/UserContext";
import { ToastContextProvider } from "context/ToastContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
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
