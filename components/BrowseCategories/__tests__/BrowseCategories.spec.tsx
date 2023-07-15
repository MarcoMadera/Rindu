import { render, screen } from "@testing-library/react";

import BrowseCategories from "components/BrowseCategories";
import { IUtilsMocks } from "types/mocks";

const { paginObject } = jest.requireActual<IUtilsMocks>(
  "utils/__tests__/__mocks__/mocks.ts"
);

describe("browseCategories", () => {
  const categories = {
    ...paginObject,
    items: [
      {
        name: "category1",
        id: "testId",
        href: "testHref",
        icons: [{ url: "" }],
      },
      {
        name: "category2",
        id: "testId2",
        href: "testHref",
        icons: [{ url: "" }],
      },
    ],
  } as SpotifyApi.PagingObject<SpotifyApi.CategoryObject>;

  it("renders", () => {
    expect.assertions(2);
    render(<BrowseCategories categories={categories} />);
    const titleValue = screen.getByText("category1");
    const titleValue2 = screen.getByText("category2");
    expect(titleValue).toHaveTextContent("category1");
    expect(titleValue2).toHaveTextContent("category2");
  });
});
