import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { DeviceConnectControl } from "components";

export default {
  title: "Components/DeviceConnectControl",
  component: DeviceConnectControl,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof DeviceConnectControl>;

const Template: StoryFn<typeof DeviceConnectControl> = () => (
  <div style={{ color: "#121212" }}>
    Go to{" "}
    <a
      href="https://developer.spotify.com/console/get-users-available-devices/"
      target="_blank"
      rel="noreferrer"
    >
      Spotify API
    </a>{" "}
    and get an access token, make sure to have the{" "}
    <code>user-read-playback-state</code> and{" "}
    <code>user-modify-playback-state</code> scopes.
    <br />
    <br />
    Once you have the token, go to the knobs section and paste it in the
    accessToken input below and click on the button.
    <br />
    <br />
    <div
      style={{
        backgroundColor: "#121212",
        width: "fit-content",
        margin: "auto",
      }}
    >
      <DeviceConnectControl />
    </div>
  </div>
);

export const Default = Template.bind({});
