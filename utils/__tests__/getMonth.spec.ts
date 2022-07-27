import { getMonth } from "utils/getMonth";

describe("getMonth", () => {
  it("should return the correct month", () => {
    expect.assertions(1);
    const month = 5;
    const expected = "JUN";
    expect(getMonth(month)).toBe(expected);
  });
});
