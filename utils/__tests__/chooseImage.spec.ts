import { chooseImage } from "utils/chooseImage";

describe("chooseImage", () => {
  it("should return the first image that matches the target width and height criteria", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [
      { width: 100, height: 100, url: "1" },
      { width: 200, height: 200, url: "2" },
      { width: 300, height: 300, url: "3" },
    ];
    const targetWidth = 200;
    const targetHeight = 200;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual(images[1]);
  });

  it("should return the largest image if no images match the criteria", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [
      { width: 100, height: 100, url: "1" },
      { width: 200, height: 200, url: "2" },
      { width: 300, height: 300, url: "3" },
    ];
    const targetWidth = 400;
    const targetHeight = 400;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual(images[2]);
  });

  it("should return the only image if it matches the criteria", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [{ width: 200, height: 200, url: "1" }];
    const targetWidth = 200;
    const targetHeight = 200;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual(images[0]);
  });

  it("should return an object with default url if the input images list is empty", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [];
    const targetWidth = 200;
    const targetHeight = 200;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual({
      url: "http://localhost:3000/defaultSongCover.jpeg",
    });
  });

  it("should return the only image if it is smaller than the target width and height criteria", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [{ width: 100, height: 100, url: "1" }];
    const targetWidth = 200;
    const targetHeight = 200;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual(images[0]);
  });

  it("should return the largest image if all images are smaller than the target width and height criteria", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [
      { width: 100, height: 100, url: "1" },
      { width: 150, height: 150, url: "2" },
      { width: 175, height: 175, url: "3" },
    ];
    const targetWidth = 200;
    const targetHeight = 200;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual(images[2]);
  });

  it("should return default url if there is no urls in the object", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [
      { width: 100, height: 100, url: "" },
      { width: 150, height: 150, url: "" },
      { width: 175, height: 175, url: "" },
    ];
    const targetWidth = 200;
    const targetHeight = 200;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual({
      url: "http://localhost:3000/defaultSongCover.jpeg",
    });
  });
  it("should return the closest down url if there is no url in the selected top object", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [
      { width: 100, height: 100, url: "1" },
      { width: 150, height: 150, url: "2" },
      { width: 175, height: 175, url: "" },
    ];
    const targetWidth = 200;
    const targetHeight = 200;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual(images[1]);
  });
  it("should return the closest url of the provided width", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [
      { width: 300, url: "1" },
      { width: 250, url: "2" },
      { width: 575, url: "3" },
    ];
    const targetWidth = 50;

    const result = chooseImage(images, targetWidth);

    expect(result).toStrictEqual(images[1]);
  });
  it("should return the closest top url if there is no url in the selected object", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [
      { width: 100, height: 100, url: "1" },
      { width: 150, height: 150, url: "" },
      { width: 175, height: 175, url: "3" },
    ];
    const targetWidth = 150;
    const targetHeight = 150;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual(images[2]);
  });
  it("should return the first element with url if not width and height provided", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [
      { width: null, height: null, url: "1" },
      { width: null, height: null, url: "" },
      { width: null, height: null, url: "3" },
    ];
    const targetWidth = 150;
    const targetHeight = 150;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual(images[0]);
  });
  it("should return the selected element with url if not width and height provided", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [
      { width: null, height: null, url: "1" },
      { width: null, height: null, url: "" },
      { width: 120, height: 120, url: "3" },
    ];
    const targetWidth = 100;
    const targetHeight = 100;

    const result = chooseImage(images, targetWidth, targetHeight);

    expect(result).toStrictEqual(images[2]);
  });
  it("should return a larger element if target is in middle", () => {
    expect.assertions(1);
    const images: Spotify.Image[] = [
      {
        height: 640,
        url: "1",
        width: 640,
      },
      {
        height: 300,
        url: "2",
        width: 300,
      },
      {
        height: 64,
        url: "3",
        width: 64,
      },
    ];
    const targetWidth = 400;

    const result = chooseImage(images, targetWidth);

    expect(result).toStrictEqual(images[0]);
  });
});
