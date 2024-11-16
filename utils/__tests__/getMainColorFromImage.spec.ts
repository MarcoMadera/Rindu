import { getMainColorFromImage } from "utils/getMainColorFromImage";

global.Image = class {
  onload: () => void;
  width: number;
  height: number;

  constructor() {
    this.onload = jest.fn();
    this.width = 100;
    this.height = 100;
    setTimeout(() => {
      this.onload();
    }, 50);
  }
} as unknown as typeof Image;

describe("getMainColorFromImage", () => {
  it("should return undefined if not img", () => {
    expect.assertions(1);

    jest.spyOn(document, "createElement").mockReturnValueOnce({
      getContext: jest.fn().mockImplementation(() => ({
        getImageData: jest.fn().mockImplementation(() => ({
          data: [0, 0, 0, 0],
        })),
        drawImage: jest.fn(),
      })),
    } as unknown as HTMLCanvasElement);
    const imageId = "image-id";
    const callback = jest.fn();
    const imgcolor = getMainColorFromImage(imageId, callback);

    expect(imgcolor).toBeUndefined();
  });

  it("should return default color for dark image", async () => {
    expect.hasAssertions();

    await new Promise<void>((done) => {
      expect.assertions(1);

      const getImageData = jest.fn().mockImplementation(() => ({
        data: [0, 0, 0, 0],
      }));
      jest.spyOn(document, "createElement").mockReturnValue({
        getContext: jest.fn().mockImplementation(() => ({
          getImageData,
          drawImage: jest.fn(),
        })),
      } as unknown as HTMLCanvasElement);

      jest.spyOn(document, "querySelector").mockReturnValue({
        src: "image-src",
      } as unknown as HTMLImageElement);

      const imageId = "image-id";
      const callback = jest.fn((color) => {
        expect(color).toBe("#7a7a7a");

        done();
      });
      getMainColorFromImage(imageId, callback);
    });
  });

  it("should return default color for white image", async () => {
    expect.hasAssertions();

    await new Promise<void>((done) => {
      expect.assertions(1);

      const getImageData = jest.fn().mockImplementation(() => ({
        data: [255, 255, 255, 255],
      }));
      jest.spyOn(document, "createElement").mockReturnValue({
        getContext: jest.fn().mockImplementation(() => ({
          getImageData,
          drawImage: jest.fn(),
        })),
      } as unknown as HTMLCanvasElement);

      jest.spyOn(document, "querySelector").mockReturnValue({
        src: "image-src",
      } as unknown as HTMLImageElement);

      const imageId = "image-id";
      const callback = jest.fn((color) => {
        expect(color).toBe("#7a7a7a");

        done();
      });
      getMainColorFromImage(imageId, callback);
    });
  });

  it("should return brown color for brown image", async () => {
    expect.hasAssertions();

    jest.restoreAllMocks();
    await new Promise<void>((done) => {
      expect.assertions(1);

      const getImageData = jest.fn().mockImplementation(() => ({
        data: [87, 39, 22, 255],
      }));
      jest.spyOn(document, "createElement").mockReturnValue({
        getContext: jest.fn().mockImplementation(() => ({
          getImageData,
          drawImage: jest.fn(),
        })),
      } as unknown as HTMLCanvasElement);

      jest.spyOn(document, "querySelector").mockReturnValue({
        src: "image-src",
      } as unknown as HTMLImageElement);

      const imageId = "image-id";
      const callback = jest.fn((color) => {
        expect(color).toBe("#572716");

        done();
      });
      getMainColorFromImage(imageId, callback);
    });
  });
});
