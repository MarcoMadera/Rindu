import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import VolumeControl from "../components/VolumeControl";
import { UserContextProvider } from "context/UserContext";
import { ToastContextProvider } from "context/ToastContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
export default {
  title: "Components/VolumeControl",
  component: VolumeControl,
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof VolumeControl>;

const Template: ComponentStory<typeof VolumeControl> = () => (
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
                alignItems: "center",
              }}
            >
              <VolumeControl />
            </div>
          </ContextMenuContextProvider>
        </SpotifyContextProvider>
      </HeaderContextProvider>
    </UserContextProvider>
  </ToastContextProvider>
);

export const Default = Template;
