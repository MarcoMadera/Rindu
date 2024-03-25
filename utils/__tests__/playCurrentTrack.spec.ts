import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { IUtilsMocks } from "types/mocks";
import { BadRequestError, NotFoundError } from "utils/errors";
import { playCurrentTrack } from "utils/playCurrentTrack";
import { play } from "utils/spotifyCalls";

jest.mock<typeof import("utils")>("utils");
jest.mock<typeof import("utils/spotifyCalls")>(
  "utils/spotifyCalls",
  () =>
    ({
      play: jest.fn().mockResolvedValue({
        status: 200,
        ok: true,
      }),
    }) as unknown as typeof import("utils/spotifyCalls")
);

const { track, user } = jest.requireActual<IUtilsMocks>("./__mocks__/mocks.ts");

describe("playCurrentTrack", () => {
  const player = {
    src: "",
    currentTime: 0,
    allTracks: [],
    play: jest.fn(),
  } as unknown as AudioPlayer;

  const config = {
    player,
    user,
    allTracks: [track],
    deviceId: "deviceId",
    playlistUri: "playlistUri",
    isSingleTrack: true,
    position: 0,
    uri: "spotify:track:123",
    isPremium: true,
  };

  it("should play a track for premium user and result must be undefined for singleTrack", async () => {
    expect.assertions(1);

    const result = await playCurrentTrack(track, config);

    expect(result).toBeUndefined();
  });

  it("should play uris for premium user", async () => {
    expect.assertions(1);

    const result = await playCurrentTrack(track, {
      ...config,
      uri: undefined,
    });

    expect(result).toBeUndefined();
  });

  it("should play a track for premium user and non single track", async () => {
    expect.assertions(1);

    const result = await playCurrentTrack(track, {
      ...config,
      isSingleTrack: false,
    });

    expect(result).toBeUndefined();
  });

  it("should play a track for non-premium user and non single track", async () => {
    expect.assertions(1);

    const result = await playCurrentTrack(track, {
      ...config,
      isPremium: false,
      isSingleTrack: false,
    });

    expect(result).toBeUndefined();
  });

  it("should return 400 for a different status", async () => {
    expect.assertions(1);
    (play as jest.Mock).mockResolvedValue({
      status: 500,
      ok: false,
    });

    async function handler() {
      await playCurrentTrack(track, { ...config, isSingleTrack: false });
    }

    await expect(handler).rejects.toThrow(BadRequestError);
  });

  it("should throw NotFoundError if status is 404", async () => {
    expect.assertions(1);
    (play as jest.Mock).mockResolvedValue({
      status: 404,
      ok: false,
    });

    async function handler() {
      await playCurrentTrack(track, { ...config, isSingleTrack: false });
    }

    await expect(handler).rejects.toThrow(NotFoundError);
  });

  it("should throw BadRequestError if not deviceId", async () => {
    expect.assertions(1);

    async function handler() {
      await playCurrentTrack(track, {
        ...config,
        deviceId: undefined,
        uri: undefined,
      });
    }

    await expect(handler).rejects.toThrow(BadRequestError);
  });
});
