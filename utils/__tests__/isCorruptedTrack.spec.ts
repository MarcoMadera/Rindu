import { ITrack } from "types/spotify";
import { isCorruptedTrack } from "utils/isCorruptedTrack";

describe("isCorruptedTrack", () => {
  it("should return true if track is corrupted", () => {
    expect.assertions(1);

    const track = {
      name: "",
      artist: [{ name: "" }],
      duration_ms: 0,
    } as ITrack;

    expect(isCorruptedTrack(track)).toBe(true);
  });

  it("should return false if track is not corrupted", () => {
    expect.assertions(1);

    const track = {
      name: "Satir",
      artist: [{ name: "Counter" }],
      duration_ms: 94822,
    } as ITrack;

    expect(isCorruptedTrack(track)).toBe(false);
  });
});
