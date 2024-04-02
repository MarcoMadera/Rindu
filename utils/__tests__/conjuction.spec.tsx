import { conjuction, Locale } from "utils";

describe("conjuction", () => {
  it("should return a string", () => {
    expect.assertions(1);
    expect(conjuction([], Locale.EN)).toBe("");
  });

  it("should return a string a s", () => {
    expect.assertions(1);
    expect(conjuction(["a"], Locale.EN)).toBe("a");
  });

  it("should return a string b", () => {
    expect.assertions(1);
    expect(conjuction(["a", "b"], Locale.EN)).toBe("a, b");
  });

  it("should return a string c", () => {
    expect.assertions(1);
    expect(conjuction(["a", "b", "c"], Locale.EN)).toBe("a, b, c");
  });

  it("should return valid conjunction for spanish", () => {
    expect.assertions(1);
    expect(conjuction(["a", "b", "c"], Locale.ES)).toBe("a, b y c");
  });

  it("should return valid conjunction for french", () => {
    expect.assertions(1);
    expect(conjuction(["a", "b", "c"], "fr")).toBe("a, b et c");
  });

  it("should return valid nodeList conjunction for spanish and react component", () => {
    expect.assertions(1);
    expect(
      conjuction(
        [
          <a key={"1"} href="1">
            1
          </a>,
          "b",
          "c",
        ],
        Locale.ES
      )
    ).toStrictEqual([
      <a key={"1"} href="1">
        1
      </a>,
      ", ",
      "b",
      " y ",
      "c",
    ]);
  });

  it("should return valid nodeList disjunction for spanish and react component", () => {
    expect.assertions(1);
    expect(
      conjuction(
        [
          <a key={"1"} href="1">
            a
          </a>,
          <a key={"2"} href="2">
            b
          </a>,
          "c",
        ],
        Locale.ES,
        { type: "disjunction" }
      )
    ).toStrictEqual([
      <a key={"1"} href="1">
        a
      </a>,
      ", ",
      <a key={"2"} href="2">
        b
      </a>,
      " o ",
      "c",
    ]);
  });
});
