import { IUtilsMocks } from "types/mocks";
import { getLyrics, LyricsAction } from "utils/getLyrics";

const { mockFetchSuccess, mockFetchError } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("getLyrics", () => {
  it("should return the lyrics of the song", async () => {
    expect.assertions(1);
    mockFetchSuccess({ lyrics: "these lyrics" });
    const response = await getLyrics(
      "artistName",
      "songTitle",
      "trackId",
      "token",
      LyricsAction.Fullscreen
    );
    expect(response).toStrictEqual({
      isFullscreen: true,
      lyrics: "these lyrics",
    });
  });

  it("should return null", async () => {
    expect.assertions(1);
    mockFetchSuccess({ lyrics: "these lyrics" }, false);
    const response = await getLyrics(
      "artistName",
      "songTitle",
      "trackId",
      "token",
      LyricsAction.Fullscreen
    );
    expect(response).toBeNull();
  });

  it("should be able to catch error", async () => {
    expect.assertions(1);
    mockFetchError();
    let lyricsError = null;
    try {
      await getLyrics(
        "artistName",
        "songTitle",
        "trackId",
        "token",
        LyricsAction.Fullscreen
      );
    } catch (error) {
      lyricsError = error;
    }
    expect(lyricsError).toStrictEqual({
      json: expect.any(Function),
      ok: false,
    });
  });
});
