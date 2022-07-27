import { conjuction } from "utils/conjuction";

describe("conjuction", () => {
  it("should return a string", () => {
    expect.assertions(1);
    expect(conjuction([])).toBe("");
  });

  it("should return a string a s", () => {
    expect.assertions(1);
    expect(conjuction(["a"])).toBe("a");
  });

  it("should return a string b", () => {
    expect.assertions(1);
    expect(conjuction(["a", "b"])).toBe("a, b");
  });

  it("should return a string c", () => {
    expect.assertions(1);
    expect(conjuction(["a", "b", "c"])).toBe("a, b, c");
  });
});
