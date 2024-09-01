import { fireEvent, render, screen } from "@testing-library/react";

import Button from "components/Button";

describe("button", () => {
  it("renders correctly", () => {
    expect.assertions(1);

    render(<Button>Click me</Button>);
    const button = screen.getByText("Click me");

    expect(button).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    expect.assertions(1);

    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    const button = screen.getByText("Click me");
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled", () => {
    expect.assertions(1);

    render(<Button disabled>Click me</Button>);
    const button = screen.getByText("Click me");

    expect(button).toBeDisabled();
  });

  it("passes all props to the button element", () => {
    expect.assertions(3);

    render(
      <Button
        disabled
        onClick={jest.fn()}
        data-testid="test-button"
        className="button"
      >
        Click me
      </Button>
    );
    const button = screen.getByTestId("test-button");

    expect(button).toHaveAttribute("disabled");
    expect(button).toHaveTextContent("Click me");
    expect(button).toHaveClass("button");
  });
});
