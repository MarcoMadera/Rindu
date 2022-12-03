import { IUtilsMocks } from "types/mocks";
import { getArtistInfo } from "utils/getArtistInfo";

const { artistInfo, mockFetchSuccess } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("getArtistInfo", () => {
  it("should return null if no artistName provided", async () => {
    expect.assertions(1);

    const result = await getArtistInfo(undefined);
    expect(result).toBeNull();
  });

  it("should call fetch", async () => {
    expect.assertions(1);
    mockFetchSuccess({ artist: artistInfo }, true);

    const result = await getArtistInfo("artistName", "api");
    expect(result).toStrictEqual(artistInfo);
  });

  it("should return null if response is not ok", async () => {
    expect.assertions(1);

    mockFetchSuccess({ artists: [artistInfo] }, false);

    const result = await getArtistInfo("artistName");
    expect(result).toBeNull();
  });
});
