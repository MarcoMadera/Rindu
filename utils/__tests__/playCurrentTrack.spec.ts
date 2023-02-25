import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { IUtilsMocks } from "types/mocks";
import { playCurrentTrack } from "utils/playCurrentTrack";
import { play } from "utils/spotifyCalls/play";

jest.mock<typeof import("utils/spotifyCalls/play")>(
  "utils/spotifyCalls/play",
  () => ({
    play: jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
    }),
  })
);

const { track, user, accessToken } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("playCurrentTrack", () => {
  it("should play a track for premium user and setPlaylistPlayingId undefined for singleTrack", async () => {
    expect.assertions(2);
    const player = {
      src: "",
      currentTime: 0,
      allTracks: [],
      play: jest.fn(),
    } as unknown as AudioPlayer;

    const setCurrentlyPlaying = jest.fn();
    const setPlaylistPlayingId = jest.fn();
    const setAccessToken = jest.fn();

    const result = await playCurrentTrack(track, {
      player,
      user,
      allTracks: [track],
      accessToken,
      deviceId: "deviceId",
      playlistUri: "playlistUri",
      setCurrentlyPlaying,
      playlistId: "playlistId",
      setPlaylistPlayingId,
      isSingleTrack: true,
      position: 0,
      setAccessToken,
      uri: "spotify:track:123",
    });

    expect(result).toBe(200);
    expect(setPlaylistPlayingId).toHaveBeenCalledWith(undefined);
  });

  it("should play uris for premium user and setPlaylistPlayingId for singleTrack", async () => {
    expect.assertions(2);
    const player = {
      src: "",
      currentTime: 0,
      allTracks: [],
      play: jest.fn(),
    } as unknown as AudioPlayer;

    const setCurrentlyPlaying = jest.fn();
    const setPlaylistPlayingId = jest.fn();
    const setAccessToken = jest.fn();

    const result = await playCurrentTrack(track, {
      player,
      user,
      allTracks: [track],
      accessToken,
      deviceId: "deviceId",
      playlistUri: "playlistUri",
      setCurrentlyPlaying,
      playlistId: "playlistId",
      setPlaylistPlayingId,
      isSingleTrack: true,
      position: 0,
      setAccessToken,
      uri: undefined,
    });

    expect(result).toBe(200);
    expect(setPlaylistPlayingId).toHaveBeenCalledWith(undefined);
  });

  it("should play a track for premium user", async () => {
    expect.assertions(2);
    const player = {
      src: "",
      currentTime: 0,
      allTracks: [],
      play: jest.fn(),
    } as unknown as AudioPlayer;

    const setCurrentlyPlaying = jest.fn();
    const setPlaylistPlayingId = jest.fn();
    const setAccessToken = jest.fn();

    const result = await playCurrentTrack(track, {
      player,
      user,
      allTracks: [track],
      accessToken,
      deviceId: "deviceId",
      playlistUri: "playlistUri",
      setCurrentlyPlaying,
      playlistId: "playlistId",
      setPlaylistPlayingId,
      isSingleTrack: false,
      position: 0,
      setAccessToken,
      uri: "spotify:track:123",
    });

    expect(result).toBe(200);
    expect(setPlaylistPlayingId).toHaveBeenCalledWith("playlistId");
  });

  it("should play a track for non-premium user", async () => {
    expect.assertions(2);
    const player = {
      src: "",
      currentTime: 0,
      allTracks: [],
      play: jest.fn(),
    } as unknown as AudioPlayer;

    const setCurrentlyPlaying = jest.fn();
    const setPlaylistPlayingId = jest.fn();
    const setAccessToken = jest.fn();

    const result = await playCurrentTrack(track, {
      player,
      user: { ...user, product: "open" },
      allTracks: [track],
      accessToken,
      deviceId: "deviceId",
      playlistUri: "playlistUri",
      setCurrentlyPlaying,
      playlistId: "playlistId",
      setPlaylistPlayingId,
      isSingleTrack: false,
      position: 0,
      setAccessToken,
      uri: "spotify:track:123",
    });

    expect(result).toBe(200);
    expect(setPlaylistPlayingId).toHaveBeenCalledWith("playlistId");
  });

  it("should return 400 for a different status", async () => {
    expect.assertions(1);
    (play as jest.Mock).mockResolvedValue({
      status: 500,
      ok: false,
    });
    const player = {
      src: "",
      currentTime: 0,
      allTracks: [],
      play: jest.fn(),
    } as unknown as AudioPlayer;

    const setCurrentlyPlaying = jest.fn();
    const setPlaylistPlayingId = jest.fn();
    const setAccessToken = jest.fn();

    const result = await playCurrentTrack(track, {
      player,
      user,
      allTracks: [track],
      accessToken,
      deviceId: "deviceId",
      playlistUri: "playlistUri",
      setCurrentlyPlaying,
      playlistId: "playlistId",
      setPlaylistPlayingId,
      isSingleTrack: false,
      position: 0,
      setAccessToken,
      uri: "spotify:track:123",
    });

    expect(result).toBe(400);
  });

  it("should return 404", async () => {
    expect.assertions(1);
    (play as jest.Mock).mockResolvedValue({
      status: 404,
      ok: false,
    });
    const player = {
      src: "",
      currentTime: 0,
      allTracks: [],
      play: jest.fn(),
    } as unknown as AudioPlayer;

    const setCurrentlyPlaying = jest.fn();
    const setPlaylistPlayingId = jest.fn();
    const setAccessToken = jest.fn();

    const result = await playCurrentTrack(track, {
      player,
      user,
      allTracks: [track],
      accessToken,
      deviceId: "deviceId",
      playlistUri: "playlistUri",
      setCurrentlyPlaying,
      playlistId: "playlistId",
      setPlaylistPlayingId,
      isSingleTrack: false,
      position: 0,
      setAccessToken,
      uri: "spotify:track:123",
    });

    expect(result).toBe(404);
  });

  it("should return 400 if not deviceId", async () => {
    expect.assertions(1);
    const player = {
      src: "",
      currentTime: 0,
      allTracks: [],
      play: jest.fn(),
    } as unknown as AudioPlayer;

    const setCurrentlyPlaying = jest.fn();
    const setPlaylistPlayingId = jest.fn();
    const setAccessToken = jest.fn();

    const result = await playCurrentTrack(track, {
      player,
      user,
      allTracks: [track],
      accessToken,
      deviceId: undefined,
      playlistUri: "playlistUri",
      setCurrentlyPlaying,
      playlistId: "playlistId",
      setPlaylistPlayingId,
      isSingleTrack: false,
      position: 0,
      setAccessToken,
      uri: undefined,
    });

    expect(result).toBe(400);
  });
});
