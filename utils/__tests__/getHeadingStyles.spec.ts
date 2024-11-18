import { PropsWithChildren } from "react";

import { Color } from "types/heading";
import { getHeadingStyles } from "utils/getHeadingStyles";

describe("getHeadingStyles", () => {
  it("should return the correct styles h1", () => {
    expect.assertions(2);

    const styles = getHeadingStyles(1, "h1", {
      color: undefined,
      fontSize: undefined,
      margin: undefined,
      textAlign: undefined,
      multiline: undefined,
    });

    expect(styles.className).toStrictEqual(expect.any(String));
    expect((styles.styles.props as PropsWithChildren).children).toBe(
      "h1.__jsx-style-dynamic-selector{color:#fff;font-weight:900;font-size:6em;margin:0;text-align:left;-webkit-line-clamp:3;pointer-events:none;-webkit-user-select:none;-moz-user-select:none;user-select:none;padding:0.08em 0px;line-height:100px}@media(max-width:768px){h1{font-size:4em;line-height:60px;padding:0 8px}}"
    );
  });

  it("should return the correct styles h2", () => {
    expect.assertions(2);

    const styles = getHeadingStyles(2, "h2", {
      color: Color.Primary,
      fontSize: "60px",
      margin: "30px 0",
      textAlign: "center",
      multiline: 2,
    });

    expect(styles.className).toStrictEqual(expect.any(String));
    expect((styles.styles.props as PropsWithChildren).children).toBe(
      "h2.__jsx-style-dynamic-selector{color:#fff;font-weight:700;font-size:60px;margin:30px 0;text-align:center;-webkit-line-clamp:2;pointer-events:auto;-webkit-user-select:auto;-moz-user-select:auto;user-select:auto;padding:0;line-height:60px}@media(max-width:768px){h2{font-size:1.8em;line-height:30px;padding:0 8px}}"
    );
  });

  it("should return the correct styles h3", () => {
    expect.assertions(2);

    const styles = getHeadingStyles(3, "h3", {
      color: undefined,
      fontSize: undefined,
      margin: undefined,
      textAlign: undefined,
      multiline: undefined,
    });

    expect(styles.className).toStrictEqual(expect.any(String));
    expect((styles.styles.props as PropsWithChildren).children).toBe(
      "h3.__jsx-style-dynamic-selector{color:#fff;font-weight:700;font-size:1.5em;margin:0;text-align:left;-webkit-line-clamp:3;pointer-events:auto;-webkit-user-select:auto;-moz-user-select:auto;user-select:auto;padding:0;line-height:28px}@media(max-width:768px){h3{font-size:1.3em;line-height:20px;padding:0 8px}}"
    );
  });
});
