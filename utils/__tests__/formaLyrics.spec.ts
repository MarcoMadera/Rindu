import formaLyrics from "utils/formatLyrics";

describe("formaLyrics", () => {
  it("should return an array of lines", () => {
    expect.assertions(1);
    const lyrics = "Hello\nWorld";
    const formattedLyrics = formaLyrics({ lyrics, isFullscreen: false });
    expect(formattedLyrics).toStrictEqual({
      lines: [{ words: "Hello" }, { words: "World" }],
      provider: "legacy",
      syncType: "UNSYNCED",
    });
  });
});
