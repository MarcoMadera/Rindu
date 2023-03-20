import React from "react";

import {
  optionsKnob as options,
  text,
  withKnobs,
} from "@storybook/addon-knobs";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { UserWidget } from "components";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { HeaderContextProvider } from "context/HeaderContext";
import { ModalContextProvider } from "context/ModalContext";
import { SpotifyContextProvider } from "context/SpotifyContext";
import { ToastContextProvider } from "context/ToastContext";
import UserContext, { IUserContext } from "context/UserContext";

export default {
  title: "Components/UserWidget",
  component: UserWidget,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [withKnobs],
} as ComponentMeta<typeof UserWidget>;

const Template: ComponentStory<typeof UserWidget> = () => (
  <ToastContextProvider>
    <UserContext.Provider
      value={
        {
          user: {
            id: "12133024755",
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
            display_name: "Marco Madera",
            images: [
              {
                url: "https://i.scdn.co/image/ab6775700000ee85483a9d1a47289376804a5234",
              },
            ],
          },
          isLogin: true,
          accessToken: text("accessToken", "you need a token here"),
        } as IUserContext
      }
    >
      <HeaderContextProvider>
        <SpotifyContextProvider>
          <ContextMenuContextProvider>
            <ModalContextProvider>
              <div
                style={{
                  padding: "2em",
                  maxWidth: "300px",
                }}
              >
                <UserWidget
                  name="Marco Madera"
                  img="https://i.scdn.co/image/ab6775700000ee85483a9d1a47289376804a5234"
                />
              </div>
            </ModalContextProvider>
          </ContextMenuContextProvider>
        </SpotifyContextProvider>
      </HeaderContextProvider>
    </UserContext.Provider>
  </ToastContextProvider>
);

export const Default = Template.bind({});
