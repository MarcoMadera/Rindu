import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CardTrack from "components/CardTrack";
import { IUtilsMocks } from "types/mocks";
import { AppProviders } from "./mocks";
import useOnScreen from "hooks/useOnScreen";
import { playCurrentTrack } from "utils/playCurrentTrack";
import type { IToast } from "types/toast";

jest.mock("next/router", () => ({
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
jest.mock("utils/playCurrentTrack");

describe("cardTrack", () => {
  const onClickAdd = jest.fn();
  it("renders", () => {
    expect.assertions(1);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    const cardTrackName = {
      ...track,
      name: "cardTrackName",
    };

    render(
      <AppProviders>
        <CardTrack
          track={cardTrackName}
          type="presentation"
          position={0}
          accessToken=""
          style={{ margin: "50px" }}
          isTrackInLibrary={false}
          isSingleTrack={true}
          playlistUri=""
          uri=""
          onClickAdd={onClickAdd}
          allTracks={[cardTrackName]}
        />
      </AppProviders>
    );
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
    render(
      <AppProviders value={{ setPlayedSource, player }}>
        <CardTrack
          track={track}
          type="presentation"
          position={0}
          accessToken=""
          style={{}}
          isTrackInLibrary={false}
          isSingleTrack={true}
          playlistUri=""
          uri=""
          onClickAdd={onClickAdd}
          allTracks={[track]}
        />
      </AppProviders>
    );
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
    let toasts: IToast[] = [];
    const player = {
      disconnect: jest.fn(),
      activateElement: jest.fn().mockResolvedValue(200),
    } as unknown as Spotify.Player;
    const setReconnectionError = jest.fn();
    const setToasts = (toastArray: IToast[] | ((toasts: IToast[]) => void)) => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (typeof toastArray === "function") {
        toastArray(toasts);
      } else {
        toasts = toastArray;
      }
    };

    render(
      <AppProviders value={{ toasts, setToasts, player, setReconnectionError }}>
        <CardTrack
          track={track}
          type="presentation"
          position={0}
          accessToken=""
          style={{}}
          isTrackInLibrary={false}
          isSingleTrack={true}
          playlistUri=""
          uri=""
          onClickAdd={onClickAdd}
          allTracks={[track]}
        />
      </AppProviders>
    );
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
    let toasts: IToast[] = [];
    const setReconnectionError = jest.fn();
    const setToasts = (toastArray: IToast[] | ((toasts: IToast[]) => void)) => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (typeof toastArray === "function") {
        toastArray(toasts);
      } else {
        toasts = toastArray;
      }
    };
    const player = {
      activateElement: jest.fn().mockResolvedValue(200),
    } as unknown as Spotify.Player;

    render(
      <AppProviders value={{ toasts, setToasts, setReconnectionError, player }}>
        <CardTrack
          track={track}
          type="presentation"
          position={0}
          accessToken=""
          style={{}}
          isTrackInLibrary={false}
          isSingleTrack={true}
          playlistUri=""
          uri=""
          onClickAdd={onClickAdd}
          allTracks={[track]}
        />
      </AppProviders>
    );
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
    let toasts: IToast[] = [];
    const setReconnectionError = jest.fn();
    const setToasts = (toastArray: IToast[] | ((toasts: IToast[]) => void)) => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (typeof toastArray === "function") {
        toastArray(toasts);
      } else {
        toasts = toastArray;
      }
    };

    render(
      <AppProviders value={{ toasts, setToasts, setReconnectionError }}>
        <CardTrack
          track={{ ...track, corruptedTrack: true }}
          type="presentation"
          position={0}
          accessToken=""
          style={{}}
          isTrackInLibrary={false}
          isSingleTrack={true}
          playlistUri=""
          uri=""
          onClickAdd={onClickAdd}
          allTracks={[track]}
        />
      </AppProviders>
    );
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
    let toasts: IToast[] = [];
    const setReconnectionError = jest.fn();
    const setToasts = (toastArray: IToast[] | ((toasts: IToast[]) => void)) => {
      // eslint-disable-next-line jest/no-conditional-in-test
      if (typeof toastArray === "function") {
        toastArray(toasts);
      } else {
        toasts = toastArray;
      }
    };

    render(
      <AppProviders value={{ toasts, setToasts, setReconnectionError }}>
        <CardTrack
          track={{ ...track, is_playable: false }}
          type="presentation"
          position={0}
          accessToken=""
          style={{}}
          isTrackInLibrary={false}
          isSingleTrack={true}
          playlistUri=""
          uri=""
          onClickAdd={onClickAdd}
          allTracks={[track]}
        />
      </AppProviders>
    );
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

    render(
      <AppProviders>
        <CardTrack
          track={{
            ...track,
            artists: [{ name: "Artist name", id: "artistId" }],
          }}
          type="presentation"
          position={0}
          accessToken=""
          style={{}}
          isTrackInLibrary={false}
          isSingleTrack={true}
          playlistUri=""
          uri=""
          onClickAdd={onClickAdd}
          allTracks={[track]}
        />
      </AppProviders>
    );
    const link = screen.getByText("Artist name");
    fireEvent.mouseEnter(link);
    expect(link).toHaveStyle("color: #fff");
  });
});
