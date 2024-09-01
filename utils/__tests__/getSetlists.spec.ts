import { IUtilsMocks } from "types/mocks";
import { getSetLists } from "utils/getSetLists";

jest.mock<typeof import("utils")>("utils");

const { mockFetchSuccess } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

const artistName = "Metallica";
const url = `https://api.setlist.fm/rest/1.0/search/setlists?artistName=${artistName}&p=1&sort=relevance`;

describe("getSetLists", () => {
  it("should return a SetLists object", async () => {
    expect.assertions(2);

    mockFetchSuccess({ setList: [] });
    const result = await getSetLists(artistName, "apiKey");

    expect(fetch).toHaveBeenCalledWith(url, expect.any(Object));
    expect(result).toStrictEqual({ setList: [] });
  });

  it("should return null if not apiKeyProvided", async () => {
    expect.assertions(1);

    const result = await getSetLists(artistName);

    expect(result).toBeNull();
  });

  it("should return null if not ok", async () => {
    expect.assertions(2);

    mockFetchSuccess({}, false);
    const result = await getSetLists(artistName, "apiKey");

    expect(fetch).toHaveBeenCalledWith(url, expect.any(Object));
    expect(result).toBeNull();
  });
});
