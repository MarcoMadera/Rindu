import { IUtilsMocks } from "types/mocks";
import { ITrack } from "types/spotify";
import { findDuplicateSongs } from "utils";

const { track } = jest.requireActual<IUtilsMocks>("./__mocks__/mocks.ts");

describe("findDuplicateSongs", () => {
  it("should return empty array if not tracks", () => {
    expect.assertions(1);

    const duplicateSongs = findDuplicateSongs([]);

    expect(duplicateSongs).toStrictEqual([]);
  });

  it("should find duplicates by duration in same artist and name", () => {
    expect.assertions(1);

    const tracks: ITrack[] = [
      { ...track, id: "1", duration_ms: 9434 },
      { ...track, id: "2", duration_ms: 9434 },
      { ...track, id: "3", duration_ms: undefined },
      { ...track, id: "4", position: 0 },
      { ...track, id: "5", duration_ms: 94434 },
      { ...track, id: "6", duration_ms: 94434 },
    ];
    const duplicateSongs = findDuplicateSongs(tracks);

    expect(duplicateSongs).toStrictEqual([
      { id: "2", index: 1 },
      { id: "6", index: 5 },
    ]);
  });

  it("should find duplicates by same ids", () => {
    expect.assertions(1);

    const tracks: ITrack[] = [
      { ...track, id: "1" },
      { ...track, id: "1" },
      { ...track, id: undefined },
    ];
    const duplicateSongs = findDuplicateSongs(tracks);

    expect(duplicateSongs).toStrictEqual([
      {
        index: 1,
        id: "1",
      },
    ]);
  });

  it("should not detect as duplication null or undefined", () => {
    expect.assertions(1);

    const tracks = [track, null, undefined] as ITrack[];
    const duplicateSongs = findDuplicateSongs(tracks);

    expect(duplicateSongs).toStrictEqual([]);
  });
});
