import { ITrack } from "types/spotify";
import { analyzePlaylist } from "utils/analyzePlaylist";
import { getAllTracksFromPlaylist } from "utils/getAllTracksFromPlaylist";

jest.mock("utils/getAllTracksFromPlaylist", () => ({
  getAllTracksFromPlaylist: jest.fn(),
}));

describe("analyzePlaylist", () => {
  it("should return null if no id or accessToken or totalTracks", async () => {
    expect.assertions(1);

    const result = await analyzePlaylist(
      undefined,
      undefined,
      false,
      "accessToken"
    );
    expect(result).toBeNull();
  });

  it("should return empty array values if there are not tracks", async () => {
    expect.assertions(1);

    (getAllTracksFromPlaylist as jest.Mock).mockResolvedValue([]);

    const result = await analyzePlaylist("id", 20, true, "accessToken");
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
        id: "id 1",
        name: "name",
        duration_ms: 123,
        artists: [{ name: "artist" }],
      },
      {
        id: "id 2",
        name: "name",
        duration_ms: 123,
        artists: [{ name: "artist" }],
      },
      {
        id: "id 3",
        name: "name",
        duration_ms: 123,
        artists: [{ name: "artist" }],
      },
    ];

    (
      getAllTracksFromPlaylist as jest.Mock<Promise<ITrack[]>>
    ).mockResolvedValue(tracks);

    const result = await analyzePlaylist("id", 20, true, "accessToken");
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
      {
        corruptedTrack: true,
        position: 0,
      },
      {
        corruptedTrack: false,
        position: 1,
      },
      {
        corruptedTrack: true,
        position: 2,
      },
      {
        corruptedTrack: true,
        position: 3,
      },
      {
        corruptedTrack: false,
        position: 4,
      },
      {
        corruptedTrack: true,
        position: 5,
      },
    ];

    (
      getAllTracksFromPlaylist as jest.Mock<Promise<ITrack[]>>
    ).mockResolvedValue(tracks);

    const result = await analyzePlaylist("id", 20, true, "accessToken");

    expect(result?.tracksToRemove).toStrictEqual([
      tracks[0],
      tracks[2],
      tracks[3],
      tracks[5],
    ]);
  });
  it("should return index 0 if corrupted track position does not exists", async () => {
    expect.assertions(1);

    const tracks: ITrack[] = [
      {
        corruptedTrack: true,
        position: 0,
      },
      {
        corruptedTrack: true,
      },
    ];

    (
      getAllTracksFromPlaylist as jest.Mock<Promise<ITrack[]>>
    ).mockResolvedValue(tracks);

    const result = await analyzePlaylist("id", 20, true, "accessToken");

    expect(result?.tracksToRemove).toStrictEqual([tracks[0]]);
  });
});
