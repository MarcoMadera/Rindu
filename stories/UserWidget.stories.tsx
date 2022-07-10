import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import UserWidget from "../components/UserWidget";
import UserContext, { IUserContext } from "context/UserContext";
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
          </ContextMenuContextProvider>
        </SpotifyContextProvider>
      </HeaderContextProvider>
    </UserContext.Provider>
  </ToastContextProvider>
);

export const Default = Template.bind({});
