import { AudioPlayer } from "hooks/useSpotifyPlayer";
import { IUtilsMocks } from "types/mocks";
import { playCurrentTrack } from "utils/playCurrentTrack";

jest.mock("utils/spotifyCalls/play", () => ({
  play: jest.fn().mockResolvedValue({
    status: 200,
    ok: true,
  }),
}));

const { track, user } = jest.requireActual<IUtilsMocks>("./__mocks__/mocks.ts");

describe("playCurrentTrack", () => {
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
      accessToken: "accessToken",
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
});
