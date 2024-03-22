import { Meta } from "@storybook/react";

import { ArtistList } from "components";
import { artist } from "utils/__tests__/__mocks__/mocks";

export default {
  title: "Components/ArtistList",
  component: ArtistList,
  parameters: {
    layout: "fullscreen",
    container: {
      backgroundTheme: "dark",
    },
    argTypes: {
      maxArtistsToShow: { control: "number" },
    },
  },
} as Meta<typeof ArtistList>;

export const Default = {
  args: {
    artists: [artist, artist, artist, artist, artist, artist],
    maxArtistsToShow: 3,
  },
};
