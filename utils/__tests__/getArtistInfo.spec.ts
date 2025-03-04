import { IUtilsMocks } from "types/mocks";
import { ArtistScrobbleInfo, getArtistInfo } from "utils";

const { artistInfo, mockFetchSuccess } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);
jest.mock<typeof import("utils/environment")>("utils/environment", () => ({
  ...jest.requireActual("utils/environment"),
  lastFmApiKey: "lastFmApiKey",
}));

describe("getArtistInfo", () => {
  it("should return null if no artistName provided", async () => {
    expect.assertions(1);

    const result = await getArtistInfo();

    expect(result).toBeNull();
  });

  it("should call fetch", async () => {
    expect.assertions(1);

    mockFetchSuccess({ artist: artistInfo }, true);

    const result = await getArtistInfo("artistName");

    expect(result).toStrictEqual(artistInfo);
  });

  it("should return empty object if response is not ok", async () => {
    expect.assertions(1);

    mockFetchSuccess({ artists: [artistInfo] }, false);

    const result = await getArtistInfo("artistName");

    expect(result).toStrictEqual({} as ArtistScrobbleInfo);
  });
});
