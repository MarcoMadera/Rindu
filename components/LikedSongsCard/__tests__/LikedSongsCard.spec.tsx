import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextRouter, useRouter } from "next/router";

import LikedSongsCard from "components/LikedSongsCard";
import { AppContextProvider } from "context/AppContextProvider";
import { IUserContext } from "context/UserContext";
import { useOnScreen } from "hooks";
import { IUtilsMocks } from "types/mocks";
import { Locale } from "utils";
import { getMyLikedSongs } from "utils/spotifyCalls";

jest.mock("hooks/useLyricsInPictureInPicture");
jest.mock<typeof import("utils/spotifyCalls")>("utils/spotifyCalls", () => ({
  ...jest.requireActual("utils/spotifyCalls"),
  getMyLikedSongs: jest.fn(),
}));

jest.mock<typeof import("hooks/useOnScreen")>("hooks/useOnScreen", () => ({
  ...jest.requireActual("hooks/useOnScreen"),
  useOnScreen: jest.fn(),
}));

jest.mock<NextRouter>("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(),
}));

const { getAllTranslations, mockPlaylistTrackResponse, nextRouterMock } =
  jest.requireActual<IUtilsMocks>("utils/__tests__/__mocks__/mocks.ts");

interface ISetupProps {
  appContextProviderProps?: Partial<
    React.ComponentProps<typeof AppContextProvider>
  >;
}
function setup({ appContextProviderProps }: ISetupProps = {}) {
  const routerMock: NextRouter = { ...nextRouterMock, push: jest.fn() };
  (useRouter as jest.Mock).mockReturnValue(routerMock);
  (useOnScreen as jest.Mock).mockImplementationOnce(() => true);

  const translations = getAllTranslations(Locale.EN);
  const view = render(
    <AppContextProvider
      translations={translations}
      {...appContextProviderProps}
    >
      <LikedSongsCard />
    </AppContextProvider>
  );
  return { view, routerMock, translations };
}

describe("likedSongsCard", () => {
  it("should render and redirect", async () => {
    expect.assertions(5);
    (getMyLikedSongs as jest.Mock).mockResolvedValueOnce(
      mockPlaylistTrackResponse
    );

    const { translations, routerMock } = setup({
      appContextProviderProps: {
        userValue: {
          user: {
            id: "likedSongsCardId",
          },
        } as IUserContext,
      },
    });

    await waitFor(() => {
      expect(getMyLikedSongs).toHaveBeenCalledWith(10);
    });

    const cardTitle = screen.getByText(
      translations.pages.collectionPlaylists.likedSongsCardTitle
    );
    const pluralDescription = screen.getByText("653 liked songs");
    const heroCardClickHandler = screen.getByTestId("heroCardClickHandler");

    expect(cardTitle).toBeInTheDocument();
    expect(pluralDescription).toBeInTheDocument();

    fireEvent.click(heroCardClickHandler);
    expect(routerMock.push).toHaveBeenCalledWith("/collection/tracks");

    fireEvent.keyDown(heroCardClickHandler, { key: "Enter", code: "Enter" });
    expect(routerMock.push).toHaveBeenCalledWith("/collection/tracks");
  });

  it("should render singular description if there is one liked track", async () => {
    expect.assertions(3);
    (getMyLikedSongs as jest.Mock).mockResolvedValueOnce({
      ...mockPlaylistTrackResponse,
      items: [mockPlaylistTrackResponse.items[0]],
      total: 1,
    });

    const { translations } = setup({
      appContextProviderProps: {
        userValue: {
          user: {
            id: "likedSongsCardId",
          },
        } as IUserContext,
      },
    });

    await waitFor(() => {
      expect(getMyLikedSongs).toHaveBeenCalledWith(10);
    });

    const cardTitle = screen.getByText(
      translations.pages.collectionPlaylists.likedSongsCardTitle
    );
    const singularDescription = screen.getByText("1 liked song");

    expect(cardTitle).toBeInTheDocument();
    expect(singularDescription).toBeInTheDocument();
  });
});
