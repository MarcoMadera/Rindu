import { render, screen } from "@testing-library/react";

import { CheckBoxControl } from "components";

describe("checkboxControl", () => {
  it("default render", () => {
    expect.assertions(1);

    render(<CheckBoxControl />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeInTheDocument();
  });

  it("renders custom checkbox", () => {
    expect.assertions(1);

    const props = {
      checked: true,
      onChange: jest.fn(),
    };
    render(<CheckBoxControl {...props} />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeInTheDocument();
  });

  it("renders with label", () => {
    expect.assertions(2);

    const props = {
      id: "my-checkbox",
      name: "my-checkbox",
      checked: true,
      onChange: jest.fn(),
    };
    render(
      <div>
        <CheckBoxControl {...props} />
        <label htmlFor={props.id}>My Checkbox Label</label>
      </div>
    );
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeInTheDocument();

    const label = screen.getByText("My Checkbox Label");

    expect(label).toBeInTheDocument();
  });

  it("renders with long label", () => {
    expect.assertions(2);

    const props = {
      id: "my-checkbox",
      name: "my-checkbox",
      checked: true,
      onChange: jest.fn(),
    };
    render(
      <div>
        <CheckBoxControl {...props} />
        <label htmlFor={props.id}>
          This is a very long label for my checkbox that should wrap to the next
          line
        </label>
      </div>
    );
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeInTheDocument();

    const label = screen.getByText(
      "This is a very long label for my checkbox that should wrap to the next line"
    );

    expect(label).toBeInTheDocument();
  });
});
