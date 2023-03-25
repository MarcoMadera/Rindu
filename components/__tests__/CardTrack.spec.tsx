import { ComponentProps } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextRouter } from "next/router";

import CardTrack, { CardType } from "components/CardTrack";
import { AppContextProvider } from "context/AppContextProvider";
import { IUserContext } from "context/UserContext";
import { useOnScreen } from "hooks";
import { IUtilsMocks } from "types/mocks";
import { ISpotifyContext } from "types/spotify";
import type { IToast } from "types/toast";
import { Language, playCurrentTrack, translations } from "utils";

jest.mock<NextRouter>("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn().mockImplementation(() => ({
    asPath: "/",
    push: jest.fn(),
    query: {
      country: "US",
    },
  })),
}));

const { track } = jest.requireActual<IUtilsMocks>(
  "utils/__tests__/__mocks__/mocks.ts"
);
jest.mock("hooks/useOnScreen");
jest.mock<typeof import("utils")>("utils", () => ({
  ...jest.requireActual<typeof import("utils")>("utils"),
  playCurrentTrack: jest.fn(),
}));

interface ISetup {
  cardTrackProps: ComponentProps<typeof CardTrack>;
  appContextProps?: Partial<
    ComponentProps<Exclude<typeof AppContextProvider, "translations">>
  >;
}

function setup(props: ISetup) {
  const allTranslations: Record<string, string>[] = Object.values(
    translations[Language.EN]
  );
  const allTranslationsFlat = allTranslations.reduce(
    (acc, cur) => ({ ...acc, ...cur }),
    {}
  );
  const view = render(
    <AppContextProvider
      {...props.appContextProps}
      translations={allTranslationsFlat}
    >
      <CardTrack {...props.cardTrackProps} />
    </AppContextProvider>
  );

  return { ...props, ...view };
}

describe("cardTrack", () => {
  // eslint-disable-next-line jest/no-hooks
  beforeAll(() => {
    // mock navigator.mediaSession
    Object.defineProperty(navigator, "mediaSession", {
      writable: true,
      value: {
        setActionHandler: jest.fn(),
        setPositionState: jest.fn(),
      },
    });

    // create a div with id="toast" and append it to document.body
    const toast = document.createElement("div");
    toast.setAttribute("id", "toast");
    document.body.appendChild(toast);

    const contextMenu = document.createElement("div");
    contextMenu.setAttribute("id", "contextMenu");
    document.body.appendChild(contextMenu);
  });
  // eslint-disable-next-line jest/require-hook
  let toasts: IToast[] = [];
  const setToasts = (toastArray: IToast[] | ((toasts: IToast[]) => void)) => {
    if (typeof toastArray === "function") {
      toastArray(toasts);
    } else {
      toasts = toastArray;
    }
  };

  const onClickAdd = jest.fn();
  it("renders", () => {
    expect.assertions(1);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    const cardTrackName = {
      ...track,
      name: "cardTrackName",
    };

    setup({
      cardTrackProps: {
        track: cardTrackName,
        type: CardType.presentation,
        position: 0,
        accessToken: "",
        style: { margin: "50px" },
        isTrackInLibrary: false,
        isSingleTrack: true,
        playlistUri: "",
        uri: "",
        onClickAdd,
      },
    });

    const titleValue = screen.getByText(cardTrackName.name);
    expect(titleValue).toHaveTextContent(cardTrackName.name);
  });

  it("should play on double click", async () => {
    expect.assertions(3);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    (playCurrentTrack as jest.Mock<Promise<number>>).mockResolvedValue(200);
    const setPlayedSource = jest.fn();
    const player = {
      activateElement: jest.fn().mockResolvedValue(200),
    } as unknown as Spotify.Player;

    setup({
      cardTrackProps: {
        track,
        type: CardType.presentation,
        position: 0,
        accessToken: "",
        isTrackInLibrary: false,
        isSingleTrack: true,
        playlistUri: "",
        uri: "",
        onClickAdd,
      },
      appContextProps: {
        spotifyValue: {
          setPlayedSource,
          player,
        } as unknown as ISpotifyContext,
        userValue: {
          user: {
            product: "premium",
          },
        } as unknown as IUserContext,
      },
    });

    const mytest = screen.getByTestId("cardTrack-container");
    fireEvent.doubleClick(mytest);
    expect(player.activateElement).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(setPlayedSource).toHaveBeenCalledWith(track.uri);
    });
  });
  it("should add toast reconnection error", async () => {
    expect.assertions(4);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    (playCurrentTrack as jest.Mock<Promise<number>>).mockResolvedValue(404);
    const player = {
      disconnect: jest.fn(),
      activateElement: jest.fn().mockResolvedValue(200),
    } as unknown as Spotify.Player;
    const setReconnectionError = jest.fn();

    setup({
      cardTrackProps: {
        track,
        type: CardType.presentation,
        position: 0,
        accessToken: "",
        style: {},
        isTrackInLibrary: false,
        isSingleTrack: true,
        playlistUri: "",
        uri: "",
        onClickAdd,
      },
      appContextProps: {
        toastValue: {
          toasts,
          setToasts,
        },
        spotifyValue: {
          player,
          setReconnectionError,
        } as unknown as ISpotifyContext,
      },
    });
    const mytest = screen.getByTestId("cardTrack-container");
    fireEvent.doubleClick(mytest);
    await waitFor(() => {
      expect(player.disconnect).toHaveBeenCalledWith();
    });
    expect(setReconnectionError).toHaveBeenCalledWith(true);
    expect(toasts).toStrictEqual([
      {
        message: "Unable to play, trying to reconnect, please wait...",
        displayTime: 10000,
        id: expect.any(String) as string,
        timeOut: expect.any(Number) as number,
        variant: "error",
      },
    ]);
  });
  it("should add toast with error playing this track", async () => {
    expect.assertions(2);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    (playCurrentTrack as jest.Mock<Promise<number>>).mockResolvedValue(400);
    const setReconnectionError = jest.fn();
    const player = {
      activateElement: jest.fn().mockResolvedValue(200),
    } as unknown as Spotify.Player;

    setup({
      cardTrackProps: {
        track,
        type: CardType.presentation,
        position: 0,
        accessToken: "",
        style: {},
        isTrackInLibrary: false,
        isSingleTrack: true,
        playlistUri: "",
        uri: "",
        onClickAdd,
      },
      appContextProps: {
        toastValue: {
          toasts,
          setToasts,
        },
        spotifyValue: {
          player,
          setReconnectionError,
        } as unknown as ISpotifyContext,
      },
    });

    const mytest = screen.getByTestId("cardTrack-container");
    fireEvent.doubleClick(mytest);
    await waitFor(() => {
      expect(toasts).toStrictEqual([
        {
          message: "Error playing this track",
          displayTime: 10000,
          id: expect.any(String) as string,
          timeOut: expect.any(Number) as number,
          variant: "error",
        },
      ]);
    });
  });
  it("should add toast with error if is corrupted track", () => {
    expect.assertions(1);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    const setReconnectionError = jest.fn();

    setup({
      cardTrackProps: {
        track: { ...track, corruptedTrack: true },
        type: CardType.presentation,
        position: 0,
        accessToken: "",
        style: {},
        isTrackInLibrary: false,
        isSingleTrack: true,
        playlistUri: "",
        uri: "",
        onClickAdd,
      },
      appContextProps: {
        toastValue: {
          toasts,
          setToasts,
        },
        spotifyValue: {
          setReconnectionError,
        } as unknown as ISpotifyContext,
      },
    });

    const mytest = screen.getByTestId("cardTrack-container");
    fireEvent.doubleClick(mytest);
    expect(toasts).toStrictEqual([
      {
        message: "This track is corrupted and cannot be played",
        displayTime: 10000,
        id: expect.any(String) as string,
        timeOut: expect.any(Number) as number,
        variant: "error",
      },
    ]);
  });
  it("should add toast with info no content available", () => {
    expect.assertions(1);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    const setReconnectionError = jest.fn();

    setup({
      cardTrackProps: {
        track: { ...track, is_playable: false, corruptedTrack: false },
        type: CardType.presentation,
        position: 0,
        accessToken: "",
        style: {},
        isTrackInLibrary: false,
        isSingleTrack: true,
        playlistUri: "",
        uri: "",
        onClickAdd,
      },
      appContextProps: {
        toastValue: {
          toasts,
          setToasts,
        },
        userValue: {
          user: {
            product: "premium",
          },
        } as unknown as IUserContext,
        spotifyValue: {
          setReconnectionError,
        } as unknown as ISpotifyContext,
      },
    });

    const mytest = screen.getByTestId("cardTrack-container");
    fireEvent.doubleClick(mytest);
    expect(toasts).toStrictEqual([
      {
        message: "This content is not available",
        displayTime: 10000,
        id: expect.any(String) as string,
        timeOut: expect.any(Number) as number,
        variant: "info",
      },
    ]);
  });
  it("should change artists styles on mouse enter", () => {
    expect.assertions(1);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);

    setup({
      cardTrackProps: {
        track: {
          ...track,
          artists: [{ name: "Artist name", id: "artistId" }],
        },
        type: CardType.presentation,
        position: 0,
        accessToken: "",
        style: {},
        isTrackInLibrary: false,
        isSingleTrack: true,
        playlistUri: "",
        uri: "",
        onClickAdd,
      },
    });

    const link = screen.getByText("Artist name");
    fireEvent.mouseEnter(link);
    expect(link).toHaveStyle("color: #fff");
  });
});
