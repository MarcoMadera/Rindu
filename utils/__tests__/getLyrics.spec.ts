import { getLyrics } from "utils/getLyrics";

describe("getLyrics", () => {
  it("should return the lyrics of the song", async () => {
    expect.assertions(1);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => ({ lyrics: "these lyrics" }),
        ok: true,
      })
    ) as unknown as () => Promise<Response>;
    const lyrics = await getLyrics("artistName", "songTitle");
    expect(lyrics).toBe("these lyrics");
  });

  it("should return null", async () => {
    expect.assertions(1);
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    ) as unknown as () => Promise<Response>;
    const lyrics = await getLyrics("artistName", "songTitle");
    expect(lyrics).toBeNull();
  });
  it("should catch error", async () => {
    expect.assertions(1);
    // eslint-disable-next-line jest/prefer-spy-on
    global.fetch = jest.fn(() => {
      throw Error("error");
    });
    const rer = await getLyrics("artistName", "songTitle");
    expect(rer).toBeNull();
  });
});
