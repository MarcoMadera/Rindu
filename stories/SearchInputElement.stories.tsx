import React, { Dispatch, SetStateAction } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { SearchInputElement } from "components";
export default {
  title: "Components/SearchInputElement",
  component: SearchInputElement,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
  },
  argTypes: {
    source: {
      options: { playlist: "playlist", search: "search" },
      control: { type: "select" },
    },
  },
} as ComponentMeta<typeof SearchInputElement>;

const Template: ComponentStory<typeof SearchInputElement> = (args) => {
  return <SearchInputElement {...args} />;
};

export const Search = Template.bind({});
Search.args = {
  setData: (() => console.info("setData")) as Dispatch<
    SetStateAction<SpotifyApi.SearchResponse | null>
  >,
  source: "search",
};
export const Playlist = Template.bind({});
Playlist.args = {
  setData: (() => console.info("setData")) as Dispatch<
    SetStateAction<SpotifyApi.SearchResponse | null>
  >,
  source: "playlist",
};
