import { colors, getRandomColor } from "utils";

describe("colors", () => {
  it("should return a color", () => {
    expect.assertions(1);
    expect(getRandomColor()).toBeDefined();
  });

  it("should return a value from colors", () => {
    expect.assertions(1);
    expect(colors).toContain(getRandomColor());
  });
});
