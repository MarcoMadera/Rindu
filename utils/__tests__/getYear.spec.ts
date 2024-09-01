import { getYear } from "utils/getYear";

describe("getYear", () => {
  it("should return the year of the date", () => {
    expect.assertions(1);

    const date = "6-27-2020";

    expect(getYear(date)).toBe(2020);
  });
});
