import { capitalizeFirstLetter } from "utils/capitalizeFirstLetter";

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a string", () => {
    expect.assertions(1);
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
  });
});
