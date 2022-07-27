import { ITrack } from "types/spotify";
import { findDuplicateSongs } from "utils/findDuplicateSongs";

describe("findDuplicateSongs", () => {
  it("should return empty array if not tracks", () => {
    expect.assertions(1);
    const re = findDuplicateSongs([]);

    expect(re).toStrictEqual([]);
  });

  it("should find duplicates by duration in same artist and name", () => {
    expect.assertions(1);
    const tracks: ITrack[] = [
      {
        id: "1",
        name: "same",
        artists: [{ name: "same artist" }],
        duration_ms: 9434,
      },
      {
        id: "2",
        name: "same",
        artists: [{ name: "same artist" }],
        duration_ms: 9434,
      },
      {
        id: "3",
        name: "same",
        artists: [{ name: "same artist" }],
        duration_ms: undefined,
      },
      {
        id: "4",
        name: "same",
        artists: [{ name: "same artist" }],
        position: 0,
      },
      {
        id: "5",
        name: "same",
        artists: [{ name: "same artist" }],
        duration_ms: 94434,
      },
      {
        id: "6",
        name: "same",
        artists: [{ name: "same artist" }],
        duration_ms: 94434,
      },
    ];
    const duplicates = findDuplicateSongs(tracks);

    expect(duplicates).toStrictEqual([
      { id: "2", index: 1 },
      { id: "6", index: 5 },
    ]);
  });

  it("should find duplicates by same ids", () => {
    expect.assertions(1);
    const tracks: ITrack[] = [{ id: "1" }, { id: "1" }];
    const duplicate = findDuplicateSongs(tracks);

    expect(duplicate).toStrictEqual([
      {
        index: 1,
        id: "1",
      },
    ]);
  });
  it("should find duplicates by same ids s", () => {
    expect.assertions(1);
    const tracks = [{ id: "1" }, null, undefined] as ITrack[];
    const duplicate = findDuplicateSongs(tracks);

    expect(duplicate).toStrictEqual([]);
  });
});
