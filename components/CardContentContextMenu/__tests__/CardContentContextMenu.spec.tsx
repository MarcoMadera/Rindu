import React from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";

import { CardContentContextMenu } from "components";
import { CardType } from "components/CardContent";
import { AppContextProvider } from "context/AppContextProvider";
import { ICardContentContextMenuData } from "types/contextMenu";
import { IUtilsMocks } from "types/mocks";
import { Language } from "utils";
import { follow } from "utils/spotifyCalls";

jest.mock<typeof import("utils/spotifyCalls/follow")>(
  "utils/spotifyCalls/follow",
  () => ({
    ...jest.requireActual<typeof import("utils/spotifyCalls/follow")>(
      "utils/spotifyCalls/follow"
    ),
    follow: jest.fn(),
  })
);

const { getAllTranslations, setupEnvironment } =
  jest.requireActual<IUtilsMocks>("utils/__tests__/__mocks__/mocks.ts");

interface IMocks {
  push?: () => void;
  useOnScreen?: boolean;
}

interface ISetupProps {
  props: { data: ICardContentContextMenuData["data"] };
  mocks?: IMocks;
}

describe("cardContentContextMenu", () => {
  const data: ICardContentContextMenuData["data"] = {
    type: CardType.ARTIST,
    id: "123",
  };

  function setup({ props, mocks }: ISetupProps) {
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      asPath: "/",
      push: mocks?.push ?? push,
      query: {
        country: "US",
      },
    }));

    const translations = getAllTranslations(Language.EN);
    render(
      <AppContextProvider translations={translations}>
        <CardContentContextMenu {...props} />
      </AppContextProvider>
    );
  }

  it("should redirect to artist", () => {
    expect.assertions(2);
    setupEnvironment({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://rindu.marcomadera.com",
    });
    const push = jest.fn();
    setup({ props: { data }, mocks: { push } });
    const goToArtistButton = screen.getByText("Go to artist");
    expect(goToArtistButton).toBeInTheDocument();
    fireEvent.click(goToArtistButton);
    expect(push).toHaveBeenCalledWith(
      "https://rindu.marcomadera.com/artist/123"
    );
  });

  it("should redirect to track if no type provided", () => {
    expect.assertions(2);
    setupEnvironment({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://rindu.marcomadera.com",
    });
    const push = jest.fn();
    setup({
      props: { data: { ...data, type: "" as CardType } },
      mocks: { push },
    });
    const goToArtistButton = screen.getByText("Go to track");
    expect(goToArtistButton).toBeInTheDocument();
    fireEvent.click(goToArtistButton);
    expect(push).toHaveBeenCalledWith(
      "https://rindu.marcomadera.com/track/123"
    );
  });

  it("should save the type", async () => {
    expect.assertions(4);
    (follow as jest.Mock).mockResolvedValueOnce(true);
    setup({ props: { data } });
    const saveButton = screen.getByText("Save artist");
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    await waitFor(() => {
      screen.getAllByRole("alertdialog");
    });
    expect(follow).toHaveBeenCalledTimes(1);
    expect(follow).toHaveBeenCalledWith("artist", "123");
    const toast = screen.getAllByRole("alertdialog");
    expect(toast[0]).toHaveTextContent("Added to library");
  });

  it("should not render Save if the type is not valid", async () => {
    expect.assertions(1);
    setup({ props: { data: { ...data, type: "INVALID_TYPE" as CardType } } });
    await waitFor(() => {
      expect(screen.queryByText("Save INVALID_TYPE")).not.toBeInTheDocument();
    });
  });

  it("should open the embed modal", async () => {
    expect.assertions(2);
    setup({ props: { data } });
    const embedButton = screen.getByText("Embed artist");
    expect(embedButton).toBeInTheDocument();
    fireEvent.click(embedButton);
    await waitFor(() => {
      screen.getByRole("dialog");
    });
    expect(screen.getByRole("dialog")).toHaveTextContent(
      "By embedding a Spotify player on your site, you are agreeing to"
    );
  });

  it("should not render Embed if there is not type and id", async () => {
    expect.assertions(1);
    setup({ props: { data: { id: "", type: "" as CardType } } });
    await waitFor(() => {
      expect(screen.queryByText("Embed")).not.toBeInTheDocument();
    });
  });
});
