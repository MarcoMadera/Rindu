import { templateReplace } from "utils/templateReplace";

describe("templateReplace", () => {
  it("should replace placeholders in a string with the corresponding values", () => {
    expect.assertions(1);

    const template = "Hello, {0}! You have {1} new messages.";
    const replacements = ["John", 3];
    const expected = "Hello, John! You have 3 new messages.";

    const result = templateReplace(template, replacements);

    expect(result).toStrictEqual(expected);
  });

  it("should handle invalid replacements by leaving the placeholder intact", () => {
    expect.assertions(1);

    const template = "Hello, {0}! You have {1} new messages.";
    const replacements = ["John"];
    const expected = "Hello, John! You have {1} new messages.";

    const result = templateReplace(template, replacements);

    expect(result).toStrictEqual(expected);
  });
});
