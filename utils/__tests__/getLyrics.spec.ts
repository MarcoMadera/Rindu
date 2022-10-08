import { IUtilsMocks } from "types/mocks";
import { getLyrics, LyricsAction } from "utils/getLyrics";

const { mockFetchSuccess, mockFetchError } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("getLyrics", () => {
  it("should return the lyrics of the song", async () => {
    expect.assertions(1);
    mockFetchSuccess({ lyrics: "these lyrics" });
    const lyrics = await getLyrics(
      "artistName",
      "songTitle",
      "trackId",
      "token",
      LyricsAction.Fullscreen
    );
    expect(lyrics).toBe("these lyrics");
  });

  it("should return null", async () => {
    expect.assertions(1);
    mockFetchSuccess({ lyrics: "these lyrics" }, false);
    const lyrics = await getLyrics(
      "artistName",
      "songTitle",
      "trackId",
      "token",
      LyricsAction.Fullscreen
    );
    expect(lyrics).toBeNull();
  });

  it("should catch error", async () => {
    expect.assertions(1);
    mockFetchError();

    const rer = await getLyrics(
      "artistName",
      "songTitle",
      "trackId",
      "token",
      LyricsAction.Fullscreen
    );
    expect(rer).toBeNull();
  });
});
