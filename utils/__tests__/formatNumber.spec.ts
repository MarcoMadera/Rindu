import { formatNumber } from "utils";

describe("formatNumber", () => {
  it("should return a string", () => {
    expect.assertions(1);
    const number = 123;
    const formattedNumer = formatNumber(number);
    expect(formattedNumer).toBe("123");
  });

  it("should return a string with a comma", () => {
    expect.assertions(1);
    const number = 123456789;
    const formattedNumer = formatNumber(number);
    expect(formattedNumer).toBe("123,456,789");
  });

  it("should return a string with a comma and a decimal", () => {
    expect.assertions(1);
    const number = 123456789.123;
    const formattedNumer = formatNumber(number);
    expect(formattedNumer).toBe("123,456,789.123");
  });

  it("should return a string with a comma and a decimal and a negative number", () => {
    expect.assertions(1);
    const number = -123456789.123;
    const formattedNumer = formatNumber(number);
    expect(formattedNumer).toBe("-123,456,789.123");
  });

  it("should return a string with a comma and a decimal number", () => {
    expect.assertions(1);
    const number = 0.1123;
    const formattedNumer = formatNumber(number);
    expect(formattedNumer).toBe("0.1,123");
  });
});
