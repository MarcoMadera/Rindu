import { render, screen } from "@testing-library/react";

import { ContentContainer } from "components";

describe("contentContainer", () => {
  it("renders main container with children", () => {
    expect.assertions(1);
    render(<ContentContainer>Test</ContentContainer>);

    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("test_render_main_container_without_children", () => {
    expect.assertions(1);
    render(<ContentContainer />);

    expect(screen.queryByText("Test")).not.toBeInTheDocument();
  });

  it("test_render_main_container_with_has_page_header_true", () => {
    expect.assertions(1);
    render(<ContentContainer hasPageHeader={true}>Test</ContentContainer>);

    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
