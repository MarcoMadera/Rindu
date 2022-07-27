import formaLyrics from "utils/formatLyrics";

describe("formaLyrics", () => {
  it("should return an array of lines", () => {
    expect.assertions(1);
    const lyrics = "Hello\nWorld";
    const result = formaLyrics(lyrics);
    expect(result).toStrictEqual(["Hello", "World"]);
  });
});
