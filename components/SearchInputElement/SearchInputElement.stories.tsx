import React, { Dispatch, SetStateAction } from "react";

import { Meta, StoryFn } from "@storybook/react";

import { SearchInputElement } from "components";
const meta: Meta<typeof SearchInputElement> = {
  title: "Components/SearchInputElement",
  component: SearchInputElement,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    source: {
      options: ["search", "playlist"],
      control: { type: "select" },
    },
  },
};
export default meta;

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
