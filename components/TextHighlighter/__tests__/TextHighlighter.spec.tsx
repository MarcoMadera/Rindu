import { render, screen } from "@testing-library/react";

import TextHighlighter from "../TextHighlighter";

describe("textHighlighter", () => {
  it("should highlight the exact match of the given text in the children string", () => {
    expect.assertions(1);
    const text = "highlight";
    const children = "This is a highlight test string";

    render(<TextHighlighter text={text}>{children}</TextHighlighter>);

    expect(screen.getByText(text)).toHaveStyle({
      backgroundColor: "#2e77d0",
      borderRadius: "4px",
      color: "#fff",
    });
  });

  it("should highlight all occurrences of the given text in the children string", () => {
    expect.assertions(2);
    const text = "highlight";
    const children = "This is a highlight test string with multiple highlights";

    render(<TextHighlighter text={text}>{children}</TextHighlighter>);

    const highlightedTexts = screen.getAllByText(text);
    highlightedTexts.forEach((highlightedText) => {
      expect(highlightedText).toHaveStyle({
        backgroundColor: "#2e77d0",
        borderRadius: "4px",
        color: "#fff",
      });
    });
  });

  it("should handle empty children without errors", () => {
    expect.assertions(1);
    const text = "highlight";
    const children = "";

    render(<TextHighlighter text={text}>{children}</TextHighlighter>);

    expect(screen.queryByText(text)).toBeNull();
  });

  it("should handle empty text without errors", () => {
    expect.assertions(1);
    const text = "";
    const children = "This is a test string";

    render(<TextHighlighter text={text}>{children}</TextHighlighter>);

    const highlightedTexts = screen.getAllByText(children);
    highlightedTexts.forEach((highlightedText) => {
      expect(highlightedText).not.toHaveStyle({
        backgroundColor: "#2e77d0",
        borderRadius: "4px",
        color: "#fff",
      });
    });
  });

  it("should handle children with only whitespace without errors", () => {
    expect.assertions(1);
    const text = "highlight";
    const children = "     ";

    render(<TextHighlighter text={text}>{children}</TextHighlighter>);

    expect(screen.queryByText(text)).toBeNull();
  });

  it("should highligh only the text on nested elements", () => {
    expect.assertions(7);
    const text = "highlight";
    const children = (
      <>
        se la no vi, highlight 1`
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          Yess no highlight 2
          <span>
            highlight 3 no<strong>yes highlight 4</strong>
          </span>
        </label>
      </>
    );

    render(<TextHighlighter text={text}>{children}</TextHighlighter>);

    const highlightedTexts = screen.getAllByText(text);
    highlightedTexts.forEach((highlightedText) => {
      expect(highlightedText).toHaveStyle({
        backgroundColor: "#2e77d0",
        borderRadius: "4px",
        color: "#fff",
      });
    });
    const notHighlightedTexts = screen.getAllByText(/no/);
    notHighlightedTexts.forEach((noHighlightedText) => {
      expect(noHighlightedText).not.toHaveStyle({
        backgroundColor: "#2e77d0",
        borderRadius: "4px",
        color: "#fff",
      });
    });
  });
});
