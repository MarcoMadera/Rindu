import React from "react";

import { render, screen, waitFor } from "@testing-library/react";

import Carousel from "components/Carousel";

describe("carousel", () => {
  it("should render the right number of boxes", async () => {
    expect.assertions(2);

    render(
      <Carousel title="test" gap={32}>
        <div data-testid="box" style={{ width: 100, height: 200 }}>
          geyrhr
        </div>
        <div data-testid="box" style={{ width: 100, height: 200 }}>
          gesyrhr
        </div>
      </Carousel>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("box")).toHaveLength(2);
    });

    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
