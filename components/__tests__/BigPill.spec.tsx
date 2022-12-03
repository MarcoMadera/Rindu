import { render, screen } from "@testing-library/react";
import BigPill from "components/BigPill";

describe("billPill", () => {
  it("renders", () => {
    expect.assertions(1);
    render(<BigPill title="test" subTitle="subtitle" href="re" img="img" />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("should no have img", () => {
    expect.assertions(1);
    render(<BigPill title="test" subTitle="subtitle" href="re" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
