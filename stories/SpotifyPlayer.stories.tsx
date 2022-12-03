import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import SpotifyPlayer from "../components/SpotifyPlayer";
import { UserContextProvider } from "context/UserContext";
import { ToastContextProvider } from "context/ToastContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
export default {
  title: "Components/SpotifyPlayer",
  component: SpotifyPlayer,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof SpotifyPlayer>;

const Template: ComponentStory<typeof SpotifyPlayer> = () => (
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
              <SpotifyPlayer />
            </div>
          </ContextMenuContextProvider>
        </SpotifyContextProvider>
      </HeaderContextProvider>
    </UserContextProvider>
  </ToastContextProvider>
);

export const Default = Template.bind({});
