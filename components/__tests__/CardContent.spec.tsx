import { ComponentProps } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { NextRouter, useRouter } from "next/router";

import { CardContent } from "components";
import { CardType, ICardContent } from "components/CardContent";
import { AppContextProvider } from "context/AppContextProvider";
import { useOnScreen } from "hooks";
import { IUtilsMocks } from "types/mocks";
import { Language } from "utils";

jest.mock<NextRouter>("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn(),
}));

jest.mock("hooks/useOnScreen");

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
  const setup = (props?: ISetup, mocks?: { push: () => void }) => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
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
    const translations = getAllTranslations(Language.EN);
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
    setup({ cardContentProps: { images: [{ url: "url" }] } }, { push });
    const mytest = screen.getByTestId("cardContent-button");
    const img = screen.getByRole("img");
    fireEvent.keyDown(mytest, { key: "Enter" });
    expect(img).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should keydown enter is visible without url", () => {
    expect.assertions(2);
    const push = jest.fn();

    setup(
      { cardContentProps: { images: [{}] as SpotifyApi.ImageObject[] } },
      { push }
    );
    const mytest = screen.getByTestId("cardContent-button");
    const img = screen.getByRole("img");
    fireEvent.keyDown(mytest, { key: "Enter" });
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
});
