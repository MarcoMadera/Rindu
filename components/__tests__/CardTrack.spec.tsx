import { ComponentProps } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import CardTrack, { CardType } from "components/CardTrack";
import { AppContextProvider } from "context/AppContextProvider";
import { IUserContext } from "context/UserContext";
import { useOnScreen } from "hooks";
import { IUtilsMocks } from "types/mocks";
import { ISpotifyContext } from "types/spotify";
import { Language, playCurrentTrack } from "utils";

const { track, getAllTranslations } = jest.requireActual<IUtilsMocks>(
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
  const translations = getAllTranslations(Language.EN);
  const view = render(
    <AppContextProvider {...props.appContextProps} translations={translations}>
      <CardTrack {...props.cardTrackProps} />
    </AppContextProvider>
  );

  return { ...props, ...view };
}

describe("cardTrack", () => {
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
        type: CardType.Presentation,
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
    expect.assertions(2);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    (playCurrentTrack as jest.Mock<Promise<number>>).mockResolvedValue(200);
    const setPlayedSource = jest.fn();
    const player = {
      activateElement: jest.fn().mockResolvedValue(200),
    } as unknown as Spotify.Player;

    setup({
      cardTrackProps: {
        track,
        type: CardType.Presentation,
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
    await waitFor(() => {
      expect(player.activateElement).toHaveBeenCalledTimes(1);
    });
    expect(setPlayedSource).toHaveBeenCalledWith(track.uri);
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
        type: CardType.Presentation,
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
        spotifyValue: {
          player,
          setReconnectionError,
        } as unknown as ISpotifyContext,
      },
    });
    const mytest = screen.getByTestId("cardTrack-container");
    fireEvent.doubleClick(mytest);
    await waitFor(() => {
      screen.getAllByRole("alertdialog");
    });
    const toast = screen.getAllByRole("alertdialog");
    expect(player.disconnect).toHaveBeenCalledWith();
    expect(toast).toHaveLength(1);
    expect(toast[0]).toHaveTextContent(
      "Unable to play, trying to reconnect, please wait..."
    );
    expect(setReconnectionError).toHaveBeenCalledWith(true);
  });
  it("should add toast with error playing this track", async () => {
    expect.assertions(1);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    (playCurrentTrack as jest.Mock<Promise<number>>).mockResolvedValue(400);
    const setReconnectionError = jest.fn();
    const player = {
      activateElement: jest.fn().mockResolvedValue(200),
    } as unknown as Spotify.Player;

    setup({
      cardTrackProps: {
        track,
        type: CardType.Presentation,
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
        spotifyValue: {
          player,
          setReconnectionError,
        } as unknown as ISpotifyContext,
      },
    });

    const mytest = screen.getByTestId("cardTrack-container");
    fireEvent.doubleClick(mytest);
    await waitFor(() => {
      const toast = screen.getAllByRole("alertdialog");
      expect(toast[0]).toHaveTextContent("Error playing this track");
    });
  });
  it("should add toast with error if is corrupted track", async () => {
    expect.assertions(1);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    const setReconnectionError = jest.fn();

    setup({
      cardTrackProps: {
        track: { ...track, corruptedTrack: true },
        type: CardType.Presentation,
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
        spotifyValue: {
          setReconnectionError,
        } as unknown as ISpotifyContext,
      },
    });

    const mytest = screen.getByTestId("cardTrack-container");
    fireEvent.doubleClick(mytest);
    await waitFor(() => {
      const toast = screen.getAllByRole("alertdialog");
      expect(toast[0]).toHaveTextContent(
        "This track is corrupted and cannot be played"
      );
    });
  });
  it("should add toast with info no content available", async () => {
    expect.assertions(1);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    const setReconnectionError = jest.fn();

    setup({
      cardTrackProps: {
        track: { ...track, is_playable: false, corruptedTrack: false },
        type: CardType.Presentation,
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
    await waitFor(() => {
      const toast = screen.getAllByRole("alertdialog");
      expect(toast[0]).toHaveTextContent("Content is unavailable");
    });
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
        type: CardType.Presentation,
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
