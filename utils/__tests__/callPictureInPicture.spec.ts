import { callPictureInPicture } from "utils/callPictureInPicture";
describe("callPictureInPicture", () => {
  it("should return undefined if not artwork defined", async () => {
    expect.assertions(1);
    Object.defineProperty(window.navigator, "mediaSession", {
      writable: true,
      value: {
        metadata: {
          artwork: undefined,
        },
      },
    });
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    const result = await callPictureInPicture(canvas, video);
    expect(result).toBeUndefined();
  });

  it("should return undefined if src artwork is undefined", async () => {
    expect.assertions(1);
    Object.defineProperty(window.navigator, "mediaSession", {
      writable: true,
      value: {
        metadata: {
          artwork: [
            {
              width: 100,
              height: 200,
            },
          ],
        },
      },
    });
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    const result = await callPictureInPicture(canvas, video);
    expect(result).toBeUndefined();
  });

  it("should log error", async () => {
    expect.assertions(1);
    Object.defineProperty(window.navigator, "mediaSession", {
      writable: true,
      value: {
        metadata: {
          artwork: [
            {
              src: "https://example.com/image.png",
              width: 100,
              height: 200,
            },
          ],
        },
      },
    });

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
    Object.defineProperty(window.navigator, "mediaSession", {
      writable: true,
      value: {
        metadata: {
          artwork: [
            {
              src: "src",
              width: 100,
              height: 200,
            },
          ],
        },
      },
    });
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
