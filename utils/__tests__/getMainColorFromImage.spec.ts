import { getMainColorFromImage } from "utils/getMainColorFromImage";

global.Image = class {
  onload: jest.Mock = jest.fn();
  width = 100;
  height = 100;
  crossOrigin = "";
  src = "";
  constructor() {
    setTimeout(() => {
      this.onload();
    }, 50);
  }
} as unknown as typeof Image;

describe("getMainColorFromImage", () => {
  it("should return undefined if no img element is found", () => {
    expect.assertions(2);

    const querySelectorMock = jest
      .spyOn(document, "querySelector")
      .mockReturnValue(null);

    const callback = jest.fn();
    const result = getMainColorFromImage("non-existent-id", callback);

    expect(result).toBeUndefined();
    expect(querySelectorMock).toHaveBeenCalledWith("#non-existent-id");

    querySelectorMock.mockRestore();
  });

  it("should return gray (#7a7a7a) if all sampled pixels are too dark", async () => {
    expect.assertions(1);

    const darkPixels = new Uint8ClampedArray(100 * 100 * 4).fill(0);
    const querySelectorMock = jest
      .spyOn(document, "querySelector")
      .mockReturnValue({ src: "dark-image-src" } as HTMLImageElement);
    const createElementMock = jest
      .spyOn(document, "createElement")
      .mockReturnValue({
        width: 100,
        height: 100,
        getContext: () => ({
          drawImage: jest.fn(),
          getImageData: () => ({ data: darkPixels }),
        }),
      } as unknown as HTMLCanvasElement);

    await new Promise<void>((resolve) => {
      getMainColorFromImage("dark-image", (color: string) => {
        expect(color.toLowerCase()).toBe("#7a7a7a");

        resolve();
      });
    });

    querySelectorMock.mockRestore();
    createElementMock.mockRestore();
  });

  it("should return gray (#7a7a7a) if all sampled pixels are too bright", async () => {
    expect.assertions(1);

    const brightPixels = new Uint8ClampedArray(100 * 100 * 4).fill(255);
    const querySelectorMock = jest
      .spyOn(document, "querySelector")
      .mockReturnValue({ src: "bright-image-src" } as HTMLImageElement);
    const createElementMock = jest
      .spyOn(document, "createElement")
      .mockReturnValue({
        width: 100,
        height: 100,
        getContext: () => ({
          drawImage: jest.fn(),
          getImageData: () => ({ data: brightPixels }),
        }),
      } as unknown as HTMLCanvasElement);

    await new Promise<void>((resolve) => {
      getMainColorFromImage("bright-image", (color: string) => {
        expect(color.toLowerCase()).toBe("#7a7a7a");

        resolve();
      });
    });

    querySelectorMock.mockRestore();
    createElementMock.mockRestore();
  });

  it("should return the dominant color when image has valid colors", async () => {
    expect.assertions(1);

    const imageData = new Uint8ClampedArray(100 * 100 * 4);
    for (let i = 0; i < imageData.length; i += 4) {
      imageData[i] = 87;
      imageData[i + 1] = 39;
      imageData[i + 2] = 22;
      imageData[i + 3] = 255;
    }

    const querySelectorMock = jest
      .spyOn(document, "querySelector")
      .mockReturnValue({ src: "valid-image-src" } as HTMLImageElement);
    const createElementMock = jest
      .spyOn(document, "createElement")
      .mockReturnValue({
        width: 100,
        height: 100,
        getContext: () => ({
          drawImage: jest.fn(),
          getImageData: () => ({ data: imageData }),
        }),
      } as unknown as HTMLCanvasElement);

    await new Promise<void>((resolve) => {
      getMainColorFromImage("valid-image", (color: string) => {
        expect(color.toLowerCase()).toBe("#b6392e");

        resolve();
      });
    });

    querySelectorMock.mockRestore();
    createElementMock.mockRestore();
  });

  it("should use cached result if available", async () => {
    expect.assertions(2);

    const imageSrc = "http://localhost/cached-image-src";
    const imageData = new Uint8ClampedArray(100 * 100 * 4).fill(255);

    const querySelectorMock = jest
      .spyOn(document, "querySelector")
      .mockImplementation(() => ({ src: imageSrc }) as HTMLImageElement);

    const canvasMock = {
      width: 100,
      height: 100,
      getContext: () => ({
        drawImage: jest.fn(),
        getImageData: () => ({ data: imageData }),
      }),
    };

    const createElementMock = jest
      .spyOn(document, "createElement")
      .mockImplementation(() => {
        return canvasMock as unknown as HTMLCanvasElement;
      });

    await new Promise<void>((resolve) => {
      getMainColorFromImage("test-image", (color: string) => {
        expect(color).toBe("#7a7a7a");

        resolve();
      });
    });

    await new Promise<void>((resolve) => {
      getMainColorFromImage("test-image", () => {
        expect(createElementMock.mock.calls).toHaveLength(1);

        resolve();
      });
    });

    querySelectorMock.mockRestore();
    createElementMock.mockRestore();
  });
});
