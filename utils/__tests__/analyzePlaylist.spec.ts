import { IUtilsMocks } from "types/mocks";
import { ITrack } from "types/spotify";
import { analyzePlaylist } from "utils/analyzePlaylist";
import { getAllTracksFromPlaylist } from "utils/getAllTracksFromPlaylist";

jest.mock("utils/getAllTracksFromPlaylist", () => ({
  getAllTracksFromPlaylist: jest.fn(),
}));
const { track, accessToken } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("analyzePlaylist", () => {
  it("should return null if no id or accessToken or totalTracks", async () => {
    expect.assertions(1);

    const result = await analyzePlaylist(
      undefined,
      undefined,
      false,
      accessToken
    );
    expect(result).toBeNull();
  });

  it("should return empty array values if there are not tracks", async () => {
    expect.assertions(1);
    (getAllTracksFromPlaylist as jest.Mock).mockResolvedValue([]);
    const result = await analyzePlaylist("id", 20, true, accessToken);
    expect(result).toStrictEqual({
      corruptedSongsIndexes: [],
      duplicateTracksIndexes: [],
      tracks: [],
      tracksToRemove: [],
    });
  });

  it("should find duplicates tracks, leave at least one and include them in tracks to remove", async () => {
    expect.assertions(1);

    const tracks: ITrack[] = [
      {
        ...track,
        id: "id 1",
        duration_ms: 123,
      },
      {
        ...track,
        id: "id 2",
        duration_ms: 123,
      },
      {
        ...track,
        id: "id 3",
        duration_ms: 123,
      },
    ];

    (
      getAllTracksFromPlaylist as jest.Mock<Promise<ITrack[]>>
    ).mockResolvedValue(tracks);

    const result = await analyzePlaylist("id", 20, true, accessToken);
    expect(result).toStrictEqual({
      corruptedSongsIndexes: [],
      duplicateTracksIndexes: [1, 2],
      tracks: tracks,
      tracksToRemove: [tracks[1], tracks[2]],
    });
  });

  it("should include all corrupted tracks in tracksToRemove", async () => {
    expect.assertions(1);

    const tracks: ITrack[] = [
      { ...track, corruptedTrack: true, position: 0 },
      {
        ...track,
        corruptedTrack: false,
        position: 1,
        id: "2",
        duration_ms: 21333,
      },
      { ...track, corruptedTrack: true, position: 2 },
      { ...track, corruptedTrack: true, position: 3 },
      { ...track, corruptedTrack: true, position: 4 },
    ];

    (
      getAllTracksFromPlaylist as jest.Mock<Promise<ITrack[]>>
    ).mockResolvedValue(tracks);

    const result = await analyzePlaylist("id", 20, true, accessToken);

    expect(result?.tracksToRemove).toStrictEqual([
      tracks[0],
      tracks[2],
      tracks[3],
      tracks[4],
    ]);
  });
  it("should return index 0 if corrupted track position does not exists", async () => {
    expect.assertions(1);

    const tracks: ITrack[] = [
      {
        ...track,
        corruptedTrack: true,
        position: 0,
        id: "id 1",
        duration_ms: 123,
      },
      {
        ...track,
        corruptedTrack: true,
        position: undefined,
        id: "id 2",
        duration_ms: 99999,
      },
    ];

    (
      getAllTracksFromPlaylist as jest.Mock<Promise<ITrack[]>>
    ).mockResolvedValue(tracks);

    const result = await analyzePlaylist("id", 20, true, accessToken);
    expect(result?.tracksToRemove).toStrictEqual([tracks[0]]);
  });
});
