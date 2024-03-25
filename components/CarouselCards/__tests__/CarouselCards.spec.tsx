import { render, screen } from "@testing-library/react";
import { NextRouter, useRouter } from "next/router";

import { CarouselCards } from "components";
import { CardType } from "components/CardContent";
import { AppContextProvider } from "context/AppContextProvider";
import { useAuth, useOnScreen } from "hooks";
import { IMappedAlbumItems } from "pages/artist/[artistId]";
import { IUtilsMocks } from "types/mocks";
import { Locale } from "utils";

jest.mock("hooks/useLyricsInPictureInPicture");
jest.mock<typeof import("hooks/useAuth")>("hooks/useAuth");
jest.mock<typeof import("hooks/useOnScreen")>("hooks/useOnScreen");
jest.mock<NextRouter>("next/router");

const { getAllTranslations, user, accessToken, nextRouterMock } =
  jest.requireActual<IUtilsMocks>("utils/__tests__/__mocks__/mocks.ts");

interface ISetupProps {
  appContextProviderProps?: Partial<
    React.ComponentProps<typeof AppContextProvider>
  >;
  props: React.ComponentProps<typeof CarouselCards>;
}

function setup({ appContextProviderProps, props }: ISetupProps) {
  const routerMock: NextRouter = { ...nextRouterMock, push: jest.fn() };
  (useRouter as jest.Mock).mockReturnValue(routerMock);
  (useAuth as jest.Mock).mockReturnValue({ user, accessToken });
  (useOnScreen as jest.Mock).mockReturnValue(true);

  const translations = getAllTranslations(Locale.EN);
  const view = render(
    <AppContextProvider
      translations={translations}
      {...appContextProviderProps}
    >
      <CarouselCards {...props} />
    </AppContextProvider>
  );
  return { view, routerMock, translations };
}

describe("carouselCards", () => {
  it("renders a Carousel component with a title and PresentationCard components for each item in the 'items' array", () => {
    expect.assertions(2);
    const items = [
      { id: "1", name: "item 1", images: [] },
      { id: "2", name: "item 2", images: [] },
      { id: "3", name: "item 3", images: [] },
    ] as unknown as IMappedAlbumItems[];
    const title = "Title";
    const type = CardType.ALBUM;
    setup({ props: { items, title, type } });
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getAllByAltText(/item.\d*/i)).toHaveLength(items.length);
  });
});

describe("carouselCards edge cases", () => {
  it("returns null if items is undefined", () => {
    expect.assertions(1);
    const items = undefined as unknown as IMappedAlbumItems[];
    const title = "Title";
    const type = CardType.ALBUM;
    const { view } = setup({ props: { items, title, type } });
    // eslint-disable-next-line testing-library/no-node-access
    expect(view.container.firstChild).toBeNull();
  });

  it("returns null if items is empty array", () => {
    expect.assertions(1);
    const items = [] as unknown as IMappedAlbumItems[];
    const title = "Title";
    const type = CardType.ALBUM;
    const { view } = setup({ props: { items, title, type } });
    // eslint-disable-next-line testing-library/no-node-access
    expect(view.container.firstChild).toBeNull();
  });

  it("does not render a PresentationCard component for an item in 'items' that is undefined", () => {
    expect.assertions(1);
    const items = [
      { id: "1", name: "item 1", images: [] },
      undefined,
      { id: "3", name: "item 3", images: [] },
    ] as unknown as IMappedAlbumItems[];
    const title = "Title";
    const type = CardType.ALBUM;
    setup({ props: { items, title, type } });
    expect(screen.getAllByAltText(/item.\d*/i)).toHaveLength(2);
  });

  it("does not render a PresentationCard component for an item in 'items' that is missing a required property", () => {
    expect.assertions(1);
    const items = [
      { id: "1", name: "item 1", images: [] },
      { id: "2", images: [] },
      { id: "3", name: "item 3", images: [] },
    ] as unknown as IMappedAlbumItems[];
    const title = "Title";
    const type = CardType.ALBUM;
    setup({ props: { items, title, type } });
    expect(screen.getAllByAltText(/item.\d*/i)).toHaveLength(2);
  });
});
