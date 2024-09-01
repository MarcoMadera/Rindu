import { render, screen } from "@testing-library/react";

import CardContainer from "components/CardContainer";

describe("cardContainer", () => {
  it("renders correctly", () => {
    expect.assertions(1);

    render(<CardContainer>Click me</CardContainer>);
    const cardContainer = screen.getByText("Click me");

    expect(cardContainer).toBeInTheDocument();
  });

  it("passes all props to the section element", () => {
    expect.assertions(3);

    render(
      <CardContainer
        onClick={jest.fn()}
        data-testid="test-CardContainer"
        className="CardContainer"
        about="about"
      >
        Click me
      </CardContainer>
    );
    const element = screen.getByTestId("test-CardContainer");

    expect(element).toHaveAttribute("about");
    expect(element).toHaveTextContent("Click me");
    expect(element).toHaveClass("CardContainer");
  });
});
