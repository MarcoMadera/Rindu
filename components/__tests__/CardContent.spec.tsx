import { fireEvent, render, screen } from "@testing-library/react";
import { NextRouter, useRouter } from "next/router";

import { CardContent } from "components";
import { CardType, ICardContent } from "components/CardContent";
import { ContextMenuContextProvider } from "context/ContextMenuContext";
import { ToastContextProvider } from "context/ToastContext";
import { useOnScreen } from "hooks";

jest.mock<NextRouter>("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(),
}));

jest.mock<typeof import("hooks")>("hooks", () => ({
  ...jest.requireActual("hooks"),
  useOnScreen: jest.fn(),
  useContextMenu: jest.fn().mockReturnValue({
    contextMenuData: {
      position: { x: 0, y: 0 },
      data: { id: "id", type: "track" },
      type: "cardContent",
    },
    removeContextMenu: jest.fn(),
    addContextMenu: jest.fn(),
  }),
  useSpotify: jest.fn().mockReturnValue({
    deviceId: "deviceId",
    playlists: [],
  }),
  useAuth: jest.fn().mockReturnValue({
    accessToken: "accessToken",
  }),
}));

describe("cardContent", () => {
  const defaultProps: ICardContent = {
    id: "id",
    subTitle: "subtitle",
    title: "title",
    type: CardType.TRACK,
  };
  const setup = (
    props?: Partial<ICardContent>,
    mocks?: { push: () => void }
  ) => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementationOnce(() => ({
      asPath: "/",
      push: mocks?.push || push,
      query: {
        country: "US",
      },
    }));
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);
    const contextMenu = document.createElement("div");
    contextMenu.setAttribute("id", "contextMenu");
    const toastDiv = document.createElement("div");
    toastDiv.setAttribute("id", "toast");
    document.body.appendChild(contextMenu);
    document.body.appendChild(toastDiv);

    return render(
      <ToastContextProvider>
        <ContextMenuContextProvider>
          <CardContent {...defaultProps} {...props} />
        </ContextMenuContextProvider>
      </ToastContextProvider>
    );
  };

  it("renders", () => {
    expect.assertions(1);
    setup();
    const titleValue = screen.getByText(defaultProps.title);
    expect(titleValue).toHaveTextContent(defaultProps.title);
  });

  it("should click", () => {
    expect.assertions(1);
    const push = jest.fn();
    setup({}, { push });
    const mytest = screen.getByTestId("cardContent-button");
    fireEvent.click(mytest);

    expect(push).toHaveBeenCalledWith(
      `/${defaultProps.type}/${defaultProps.id}`
    );
  });

  it("should keydown enter", () => {
    expect.assertions(1);
    const push = jest.fn();

    setup({}, { push });
    const mytest = screen.getByTestId("cardContent-button");
    fireEvent.keyDown(mytest, { key: "Enter" });

    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should keydown enter is visible", () => {
    expect.assertions(2);
    const push = jest.fn();
    setup({ images: [{ url: "url" }] }, { push });
    const mytest = screen.getByTestId("cardContent-button");
    const img = screen.getByRole("img");
    fireEvent.keyDown(mytest, { key: "Enter" });
    expect(img).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should keydown enter is visible without url", () => {
    expect.assertions(2);
    const push = jest.fn();

    setup({ images: [{}] as SpotifyApi.ImageObject[] }, { push });
    const mytest = screen.getByTestId("cardContent-button");
    const img = screen.getByRole("img");
    fireEvent.keyDown(mytest, { key: "Enter" });
    expect(img).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should take a component in subtitle", () => {
    expect.assertions(1);
    setup({ subTitle: <span data-testid="subcomponent">Heey</span> });
    const mytest = screen.getByTestId("subcomponent");
    expect(mytest).toBeInTheDocument();
  });

  it("should have border radius 50% if type artist", () => {
    expect.assertions(1);
    setup({ type: CardType.ARTIST, images: [{ url: "eer" }] });

    const mytest = screen.getByRole("img");
    expect(mytest).toHaveStyle({
      borderRadius: "50%",
    });
  });
});
