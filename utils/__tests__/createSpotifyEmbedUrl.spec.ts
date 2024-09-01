import { createSpotifyEmbedUrl } from "utils";

describe("createSpotifyEmbedUrl", () => {
  it("should generate URL with all parameters", () => {
    expect.assertions(1);

    const params = {
      type: "track",
      id: "5FjDf8x39fpMJPhElkhfp9",
      hasTimeStampChanged: true,
      timeStamp: "00:45",
      theme: "dark",
    };
    const expectedUrl =
      "https://open.spotify.com/embed/track/5FjDf8x39fpMJPhElkhfp9?utm_source=generator&t=45&theme=dark";

    expect(createSpotifyEmbedUrl(params)).toBe(expectedUrl);
  });

  it("should generate URL without timestamp if hasTimeStampChanged is false", () => {
    expect.assertions(1);

    const params = {
      type: "track",
      id: "5FjDf8x39fpMJPhElkhfp9",
      hasTimeStampChanged: false,
      timeStamp: undefined,
      theme: "dark",
    };
    const expectedUrl =
      "https://open.spotify.com/embed/track/5FjDf8x39fpMJPhElkhfp9?utm_source=generator&theme=dark";

    expect(createSpotifyEmbedUrl(params)).toBe(expectedUrl);
  });

  it("should generate URL without theme", () => {
    expect.assertions(1);

    const params = {
      type: "track",
      id: "5FjDf8x39fpMJPhElkhfp9",
      hasTimeStampChanged: true,
      timeStamp: "1:45",
      theme: undefined,
    };
    const expectedUrl =
      "https://open.spotify.com/embed/track/5FjDf8x39fpMJPhElkhfp9?utm_source=generator&t=105";

    expect(createSpotifyEmbedUrl(params)).toBe(expectedUrl);
  });

  it("should generate URL without timestamp and theme", () => {
    expect.assertions(1);

    const params = {
      type: "track",
      id: "5FjDf8x39fpMJPhElkhfp9",
      hasTimeStampChanged: false,
      timeStamp: undefined,
      theme: undefined,
    };
    const expectedUrl =
      "https://open.spotify.com/embed/track/5FjDf8x39fpMJPhElkhfp9?utm_source=generator";

    expect(createSpotifyEmbedUrl(params)).toBe(expectedUrl);
  });

  it("should handle missing timestamp when hasTimeStampChanged is true", () => {
    expect.assertions(1);

    const params = {
      type: "track",
      id: "5FjDf8x39fpMJPhElkhfp9",
      hasTimeStampChanged: true,
      timeStamp: undefined,
      theme: "light",
    };
    const expectedUrl =
      "https://open.spotify.com/embed/track/5FjDf8x39fpMJPhElkhfp9?utm_source=generator&theme=light";

    expect(createSpotifyEmbedUrl(params)).toBe(expectedUrl);
  });
});
