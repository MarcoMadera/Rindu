import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DeviceConnectControl from "../components/DeviceConnectControl";
import UserContext, { Context } from "context/UserContext";
import { ToastContextProvider } from "context/ToastContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import {
  withKnobs,
  text,
  optionsKnob as options,
} from "@storybook/addon-knobs";

export default {
  title: "Components/DeviceConnectControl",
  component: DeviceConnectControl,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof DeviceConnectControl>;

const Template: ComponentStory<typeof DeviceConnectControl> = () => (
  <ToastContextProvider>
    <UserContext.Provider
      value={
        {
          user: {
            product: options(
              "product",
              {
                Premium: "premium",
                Open: "open",
              },
              "premium",
              {
                display: "inline-radio",
              }
            ),
          },
          accessToken: text("accessToken", "you need a token here"),
        } as Context
      }
    >
      <HeaderContextProvider>
        <SpotifyContextProvider>
          <ContextMenuContextProvider>
            <div
              style={{
                position: "absolute",
                width: "50%",
                margin: "0 auto",
                left: "0",
                right: "0",
                top: "70%",
              }}
            >
              <DeviceConnectControl />
            </div>
          </ContextMenuContextProvider>
        </SpotifyContextProvider>
      </HeaderContextProvider>
    </UserContext.Provider>
  </ToastContextProvider>
);

export const Default = Template.bind({});
