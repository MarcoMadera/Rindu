import React, { ComponentProps } from "react";

import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import { CardSubTitle } from "components";
import { CardType } from "components/CardContent";
import { AppContextProvider } from "context/AppContextProvider";
import { useOnScreen } from "hooks";
import { IUtilsMocks } from "types/mocks";
import { Language } from "utils";

jest.mock("hooks/useLyricsInPictureInPicture");
jest.mock("hooks/useOnScreen");

const { getAllTranslations } = jest.requireActual<IUtilsMocks>(
  "utils/__tests__/__mocks__/mocks.ts"
);

interface IMocks {
  push?: () => void;
  useOnScreen?: boolean;
}

interface ISetupProps {
  props: ComponentProps<typeof CardSubTitle>;
  mocks?: IMocks;
}

describe("cardSubTitle", () => {
  function setup({ props, mocks }: ISetupProps) {
    (useOnScreen as jest.Mock).mockImplementationOnce(
      () => mocks?.useOnScreen ?? true
    );
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
        <CardSubTitle {...props} />
      </AppContextProvider>
    );
  }

  it("should receive correct props when type is ALBUM and compilation is in item", () => {
    expect.assertions(1);
    const item = {
      album_type: "compilation",
      artists: [
        {
          name: "artist1",
        },
        {
          name: "artist2",
        },
      ],
      release_date: "2022-02-04",
    } as unknown as ISetupProps["props"]["item"];
    const push = jest.fn();
    setup({ props: { type: CardType.ALBUM, item }, mocks: { push } });
    expect(
      screen.getAllByText((_, element) => {
        return element?.textContent === "2022 · Compilation · artist1, artist2";
      })
    ).toBeTruthy();
  });
});
