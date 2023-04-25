import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { PlaylistTopBarExtraField, TopBar } from "components";

export default {
  title: "Components/TopBar",
  component: TopBar,
  parameters: {
    layout: "fullscreen",
    spotifyValue: { pageDetails: { name: "Extra field" } },
    container: {
      disablePadding: true,
    },
  },
} as Meta<typeof TopBar>;

const Template: StoryFn<typeof TopBar> = () => <TopBar />;

export const Default = Template.bind({});
export const LoggedIn = Template.bind({});
export const LoggedInWithExtraField = Template.bind({});

LoggedIn.parameters = {
  layout: "fullscreen",
  nextjs: {
    router: {
      pathname: "/dashboard",
      query: {
        country: "US",
      },
    },
  },
};

LoggedInWithExtraField.parameters = {
  layout: "fullscreen",
  nextjs: {
    router: {
      pathname: "/dashboard",
      query: {
        country: "US",
      },
    },
  },
  spotifyValue: { pageDetails: { name: "Skinny Dipping" } },
  headerValue: {
    element: <PlaylistTopBarExtraField uri={"2OLNxlrm2OCdATbUaonmEh"} />,
    displayOnFixed: true,
  },
};
