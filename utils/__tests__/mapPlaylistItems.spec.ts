import { IUtilsMocks } from "types/mocks";
import { mapPlaylistItems } from "utils/mapPlaylistItems";

const { playlistTrackResponse } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("mapPlaylistItems", () => {
  it("should map playlist items", () => {
    expect.assertions(2);
    const { track, added_by, ...res } = playlistTrackResponse;
    const mappedPlaylistItems = mapPlaylistItems([playlistTrackResponse], 0);

    expect(mappedPlaylistItems).toStrictEqual([
      {
        ...res,
        ...track,
        position: 0,
        corruptedTrack: false,
      },
    ]);

    expect(mappedPlaylistItems).not.toStrictEqual([
      {
        ...res,
        ...track,
        position: 0,
        corruptedTrack: false,
        added_by,
      },
    ]);
  });

  it("should return empty array if no items", () => {
    expect.assertions(1);
    const playlistItems = undefined;

    const mappedPlaylistItems = mapPlaylistItems(playlistItems, 0);

    expect(mappedPlaylistItems).toStrictEqual([]);
  });
});
