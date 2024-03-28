import { ComponentProps } from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";

import { CardContent } from "components";
import { CardType, ICardContent } from "components/CardContent";
import { AppContextProvider } from "context/AppContextProvider";
import { useOnScreen } from "hooks";
import { IUtilsMocks } from "types/mocks";
import { Locale } from "utils";

jest.mock("hooks/useOnScreen");
jest.mock("hooks/useLyricsInPictureInPicture");
const { getAllTranslations } = jest.requireActual<IUtilsMocks>(
  "utils/__tests__/__mocks__/mocks.ts"
);

describe("cardContent", () => {
  const defaultProps: ICardContent = {
    id: "id",
    subTitle: "subtitle",
    title: "title",
    type: CardType.TRACK,
  };
  interface ISetup {
    cardContentProps?: Partial<ICardContent>;
    appContextProps?: Partial<
      ComponentProps<Exclude<typeof AppContextProvider, "translations">>
    >;
  }
  interface IMocks {
    push?: () => void;
    useOnScreen?: boolean;
  }
  const setup = (props?: ISetup, mocks?: IMocks) => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      asPath: "/",
      push: mocks?.push || push,
      query: {
        country: "US",
      },
    }));
    (useOnScreen as jest.Mock).mockImplementationOnce(
      () => mocks?.useOnScreen ?? true
    );
    const contextMenu = document.createElement("div");
    contextMenu.setAttribute("id", "contextMenu");
    const toastDiv = document.createElement("div");
    toastDiv.setAttribute("id", "toast");
    document.body.appendChild(contextMenu);
    document.body.appendChild(toastDiv);
    const translations = getAllTranslations(Locale.EN);
    const view = render(
      <AppContextProvider
        {...props?.appContextProps}
        translations={translations}
      >
        <CardContent {...defaultProps} {...props?.cardContentProps} />
      </AppContextProvider>
    );
    return { ...props, ...view };
  };

  it("renders", () => {
    expect.assertions(1);
    setup();
    const titleValue = screen.getByText(defaultProps.title);
    expect(titleValue).toHaveTextContent(defaultProps.title);
  });

  it("should click", () => {
    expect.assertions(2);
    const push = jest.fn();
    setup({}, { push });
    const mytest = screen.getByTestId("cardContent-button");
    fireEvent.click(mytest);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith(
      `/${defaultProps.type}/${defaultProps.id}`
    );
  });

  it("should keydown enter", async () => {
    expect.assertions(1);
    const push = jest.fn();

    setup({}, { push });
    const mytest = screen.getByTestId("cardContent-button");
    await userEvent.click(mytest);
    await userEvent.keyboard("[Enter]");

    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should keydown enter is visible", async () => {
    expect.assertions(2);
    const push = jest.fn();
    setup({ cardContentProps: { images: [{ url: "url" }] } }, { push });
    const mytest = screen.getByTestId("cardContent-button");
    const img = screen.getByRole("img");
    await userEvent.click(mytest);
    await userEvent.keyboard("[Enter]");
    expect(img).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should keydown enter is visible without url", async () => {
    expect.assertions(2);
    const push = jest.fn();

    setup(
      { cardContentProps: { images: [{}] as SpotifyApi.ImageObject[] } },
      { push }
    );
    const mytest = screen.getByTestId("cardContent-button");
    const img = screen.getByRole("img");
    await userEvent.click(mytest);
    await userEvent.keyboard("[Enter]");
    expect(img).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should take a component in subtitle", () => {
    expect.assertions(1);
    setup({
      cardContentProps: {
        subTitle: <span data-testid="subcomponent">Heey</span>,
      },
    });
    const mytest = screen.getByTestId("subcomponent");
    expect(mytest).toBeInTheDocument();
  });

  it("should have border radius 50% if type artist", () => {
    expect.assertions(1);
    setup({
      cardContentProps: { type: CardType.ARTIST, images: [{ url: "eer" }] },
    });

    const mytest = screen.getByRole("img");
    expect(mytest).toHaveStyle({
      borderRadius: "50%",
    });
  });

  it("should have tabIndex -1 when passed from props", () => {
    expect.assertions(1);
    setup(
      {
        cardContentProps: {
          type: CardType.ARTIST,
          images: [{}] as SpotifyApi.ImageObject[],
          tabIndex: -1,
        },
      },
      { useOnScreen: false }
    );

    const mytest = screen.getByTestId("cardContent-button");
    expect(mytest).toHaveAttribute("tabIndex", "-1");
  });

  it("should redirect to the passed url onclick if the card is simple and should not open context menu", () => {
    expect.assertions(3);
    const push = jest.fn();
    setup(
      {
        cardContentProps: {
          type: CardType.SIMPLE,
          images: [{}] as SpotifyApi.ImageObject[],
          url: "url",
        },
      },
      { push }
    );

    const mytest = screen.getByTestId("cardContent-button");
    fireEvent.click(mytest);
    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("url");
    fireEvent.contextMenu(mytest);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should not react onKeyDown Enter or onclick if not passed type", async () => {
    expect.assertions(2);
    const push = jest.fn();
    setup(
      {
        cardContentProps: {
          type: undefined,
          images: [{}] as SpotifyApi.ImageObject[],
          url: "url",
        },
      },
      { push }
    );

    const mytest = screen.getByTestId("cardContent-button");
    await userEvent.click(mytest);
    await userEvent.keyboard("[Enter]");
    expect(push).toHaveBeenCalledTimes(0);
    fireEvent.click(mytest);
    expect(push).toHaveBeenCalledTimes(0);
  });

  it("should open the context menu for artists", async () => {
    expect.assertions(2);
    setup({
      cardContentProps: {
        type: CardType.ARTIST,
        images: [{}] as SpotifyApi.ImageObject[],
        url: "url",
      },
    });

    const mytest = screen.getByTestId("cardContent-button");
    fireEvent.contextMenu(mytest);
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
    expect(screen.getByRole("menu")).toHaveAttribute("data-type", "artist");
  });

  it("should open the context menu for tracks", async () => {
    expect.assertions(2);
    setup({
      cardContentProps: {
        type: CardType.TRACK,
        images: [{}] as SpotifyApi.ImageObject[],
        url: "url",
      },
    });

    const mytest = screen.getByTestId("cardContent-button");
    fireEvent.contextMenu(mytest);
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
    expect(screen.getByRole("menu")).toHaveAttribute("data-type", "track");
  });
});
