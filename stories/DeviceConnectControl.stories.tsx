import React from "react";

import {
  optionsKnob as options,
  text,
  withKnobs,
} from "@storybook/addon-knobs";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { DeviceConnectControl } from "components";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ToastContextProvider } from "context/ToastContext";
import UserContext, { IUserContext } from "context/UserContext";

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
        } as IUserContext
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
