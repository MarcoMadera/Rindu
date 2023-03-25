import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

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
} as ComponentMeta<typeof TopBar>;

const Template: ComponentStory<typeof TopBar> = () => <TopBar />;

export const Default = Template.bind({});
export const LoggedIn = Template.bind({});
export const LoggedInWithExtraField = Template.bind({});

LoggedIn.parameters = {
  layout: "fullscreen",
  nextRouter: {
    query: {
      country: "US",
    },
    pathname: "/dashboard",
  },
};

LoggedInWithExtraField.parameters = {
  layout: "fullscreen",
  nextRouter: {
    query: {
      country: "US",
    },
    pathname: "/dashboard",
  },
  spotifyValue: { pageDetails: { name: "Skinny Dipping" } },
  headerValue: {
    element: <PlaylistTopBarExtraField uri={"2OLNxlrm2OCdATbUaonmEh"} />,
    displayOnFixed: true,
  },
};
