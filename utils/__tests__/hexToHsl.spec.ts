import { hexToHsl } from "utils/hexToHsl";

describe("hexToHsl", () => {
  it("should return hsl color values", () => {
    expect.assertions(1);

    const hsl = hexToHsl("#ff0000", true);

    expect(hsl).toStrictEqual([0, 100, 50]);
  });

  it("should return hsl color", () => {
    expect.assertions(1);

    const hsl = hexToHsl("#ff0000");

    expect(hsl).toBe("hsl(0, 100%, 50%)");
  });

  it("should return null if alpha provided", () => {
    expect.assertions(1);

    const hsl = hexToHsl("#ff00003b");

    expect(hsl).toBeNull();
  });

  it("should return value for achromatic color", () => {
    expect.assertions(1);

    const hsl = hexToHsl("#000000");

    expect(hsl).toBe("hsl(0, 0%, 0%)");
  });

  it("should return value for a colors", () => {
    expect.assertions(1);

    const hsl = hexToHsl("#abcdef");

    expect(hsl).toBe("hsl(210, 68%, 80%)");
  });

  it("should return value for green color", () => {
    expect.assertions(1);

    const hsl = hexToHsl("#00ff00");

    expect(hsl).toBe("hsl(120, 100%, 50%)");
  });

  it("should return value for red/blue color", () => {
    expect.assertions(1);

    const hsl = hexToHsl("#ff00ee");

    expect(hsl).toBe("hsl(304, 100%, 50%)");
  });
});
