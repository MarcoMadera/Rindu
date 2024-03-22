import React, { Dispatch, SetStateAction } from "react";

import { Meta, StoryFn } from "@storybook/react";

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
} as Meta<typeof SearchInputElement>;

const Template: StoryFn<typeof SearchInputElement> = (args) => {
  return <SearchInputElement {...args} />;
};

export const Search = {
  render: Template,

  args: {
    setData: (() => console.info("setData")) as Dispatch<
      SetStateAction<SpotifyApi.SearchResponse | null>
    >,
    source: "search",
  },
};

export const Playlist = {
  render: Template,

  args: {
    setData: (() => console.info("setData")) as Dispatch<
      SetStateAction<SpotifyApi.SearchResponse | null>
    >,
    source: "playlist",
  },
};
