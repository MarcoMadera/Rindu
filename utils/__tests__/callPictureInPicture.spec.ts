import { IUtilsMocks } from "types/mocks";
import { callPictureInPicture } from "utils/callPictureInPicture";

const { setupMediaSession } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("callPictureInPicture", () => {
  it("should return undefined if not artwork defined", async () => {
    expect.assertions(1);
    setupMediaSession({
      metadata: {
        artwork: undefined,
      },
    } as unknown as MediaSession);
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    const result = await callPictureInPicture(canvas, video);
    expect(result).toBeUndefined();
  });

  it("should return undefined if src artwork is undefined", async () => {
    expect.assertions(1);
    setupMediaSession({
      metadata: {
        artwork: [
          {
            width: 100,
            height: 200,
          },
        ],
      },
    } as unknown as MediaSession);
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    const result = await callPictureInPicture(canvas, video);
    expect(result).toBeUndefined();
  });

  it("should log error", async () => {
    expect.assertions(1);
    setupMediaSession();

    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    const log = jest.spyOn(console, "log");

    await callPictureInPicture(canvas, video);
    expect(log).toHaveBeenCalledWith(
      new TypeError("image.decode is not a function")
    );
  });

  it("should call requestPictureInPicture", async () => {
    expect.assertions(4);
    setupMediaSession();
    Object.defineProperty(Image.prototype, "decode", {
      writable: true,
      value: jest.fn(() => Promise.resolve()),
    });
    const drawImage = jest.fn();
    const canvas = {
      getContext: jest.fn().mockImplementation(() => ({
        drawImage,
      })),
    } as unknown as HTMLCanvasElement;

    const video = {
      play: jest.fn().mockResolvedValue({}),
      requestPictureInPicture: jest.fn().mockResolvedValue({}),
    } as unknown as HTMLVideoElement;

    await callPictureInPicture(canvas, video);
    expect(canvas.getContext).toHaveBeenCalledWith("2d");
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 512, 512);
    expect(video.requestPictureInPicture).toHaveBeenCalledWith();
    expect(video.play).toHaveBeenCalledWith();
  });
});
