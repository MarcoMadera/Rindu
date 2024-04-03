import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";

import ArtistList, { IArtistListProps } from "components/ArtistList";
import { AppContextProvider } from "context/AppContextProvider";
import { useOnScreen } from "hooks/useOnScreen";
import { IUtilsMocks } from "types/mocks";
import { ITrackArtist } from "types/spotify";
import { Locale } from "utils";

const { getAllTranslations } = jest.requireActual<IUtilsMocks>(
  "utils/__tests__/__mocks__/mocks.ts"
);
jest.mock<typeof import("hooks/useOnScreen")>("hooks/useOnScreen", () => ({
  useOnScreen: jest.fn().mockReturnValue(true),
}));
jest.mock("hooks/useLyricsInPictureInPicture");

function setup(props: IArtistListProps) {
  const translations = getAllTranslations(Locale.EN);
  const view = render(
    <AppContextProvider translations={translations}>
      <ArtistList {...props} />
    </AppContextProvider>
  );
  return { ...props, ...view };
}

describe("artistList", () => {
  const artists: ITrackArtist[] = [
    { id: "1", name: "Artist 1" },
    { id: "2", name: "Artist 2" },
    { uri: "spotify:artist:3", name: "Artist 3" },
    { uri: "spotify::4", name: "Artist 4" },
    { type: "artist" },
  ];

  it("renders the artist names", () => {
    expect.assertions(1);
    setup({ artists, maxArtistsToShow: 3 });
    const artistNames = screen.getAllByText(/artist/i);
    expect(artistNames).toHaveLength(3);
  });

  it("renders only the first two artists when maxArtistsToShow is 2", () => {
    expect.assertions(1);
    setup({ artists, maxArtistsToShow: 2 });
    const artistNames = screen.getAllByText(/artist/i);
    expect(artistNames).toHaveLength(2);
  });

  it("calls onClick when an artist name is clicked", () => {
    expect.assertions(1);
    const onClick = jest.fn();
    setup({ artists, onClick });
    const artistName = screen.getByText(/artist 1/i);
    fireEvent.click(artistName);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should get the artist id from uri if not provided", () => {
    expect.assertions(1);
    setup({ artists, maxArtistsToShow: artists.length });
    const artistNames = screen.getAllByText(/artist/i);
    expect(artistNames).toHaveLength(4);
  });

  it("should not render the list if artists length is 0", () => {
    expect.assertions(1);
    setup({ artists: [] });
    const artistNames = screen.queryAllByText(/artist/i);
    expect(artistNames).toHaveLength(0);
  });

  it("should not render the list if there are no artist names", () => {
    expect.assertions(1);
    setup({ artists: [{ id: "1" }] });
    const artistNames = screen.queryAllByText(/artist/i);
    expect(artistNames).toHaveLength(0);
  });

  it("should not render the list if there are no artists", () => {
    expect.assertions(1);
    (useOnScreen as jest.Mock).mockReturnValue(false);
    setup({ artists: undefined });
    const artistNames = screen.queryAllByText(/artist/i);
    expect(artistNames).toHaveLength(0);
  });

  it("should render span if there is no id and name", () => {
    expect.assertions(3);
    setup({
      artists: [{ name: "artist 1" }, { name: "artist 2" }],
      maxArtistsToShow: 2,
    });
    const artistNames = screen.queryAllByText(/artist/i);
    expect(artistNames).toHaveLength(2);
    expect(artistNames[0].tagName).toBe("SPAN");
    expect(artistNames[1].tagName).toBe("SPAN");
  });
});
