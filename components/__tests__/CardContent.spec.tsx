import { CardContent, CardType } from "components/CardContent";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import useOnScreen from "hooks/useOnScreen";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
jest.mock("hooks/useOnScreen");

describe("cardContent", () => {
  it("renders", () => {
    expect.assertions(1);
    render(
      <CardContent id="id" subTitle={"subtitle"} title="title" type="track" />
    );
    const titleValue = screen.getByText("title");
    expect(titleValue).toHaveTextContent("title");
  });

  it("should click", () => {
    expect.assertions(1);
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementationOnce(() => ({
      asPath: "/",
      push,
      query: {
        country: "US",
      },
    }));

    render(
      <CardContent id="id" subTitle={"subtitle"} title="title" type="track" />
    );
    const mytest = screen.getByTestId("cardContent-button");
    fireEvent.click(mytest);

    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should keydown enter", () => {
    expect.assertions(1);
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementationOnce(() => ({
      asPath: "/",
      push,
      query: {
        country: "US",
      },
    }));

    render(
      <CardContent id="id" subTitle={"subtitle"} title="title" type="track" />
    );
    const mytest = screen.getByTestId("cardContent-button");
    fireEvent.keyDown(mytest, { key: "Enter" });

    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should keydown enter is visible", () => {
    expect.assertions(2);
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementationOnce(() => ({
      asPath: "/",
      push,
      query: {
        country: "US",
      },
    }));
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);

    render(
      <CardContent
        id="id"
        subTitle={"subtitle"}
        title="title"
        type="track"
        images={[{ url: "url" }]}
      />
    );
    const mytest = screen.getByTestId("cardContent-button");
    const img = screen.getByRole("img");
    fireEvent.keyDown(mytest, { key: "Enter" });
    expect(img).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should keydown enter is visible without url", () => {
    expect.assertions(2);
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementationOnce(() => ({
      asPath: "/",
      push,
      query: {
        country: "US",
      },
    }));
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);

    render(
      <CardContent
        id="id"
        subTitle={"subtitle"}
        title="title"
        type="track"
        images={[{}] as SpotifyApi.ImageObject[]}
      />
    );
    const mytest = screen.getByTestId("cardContent-button");
    const img = screen.getByRole("img");
    fireEvent.keyDown(mytest, { key: "Enter" });
    expect(img).toBeInTheDocument();
    expect(push).toHaveBeenCalledWith("/track/id");
  });

  it("should take a component in subtitle", () => {
    expect.assertions(1);
    (useOnScreen as jest.Mock).mockImplementationOnce(() => true);

    render(
      <CardContent
        id="id"
        subTitle={<span data-testId="subcomponent">Heey</span>}
        title="title"
        type="track"
        images={[{}] as SpotifyApi.ImageObject[]}
      />
    );
    const mytest = screen.getByTestId("subcomponent");
    expect(mytest).toBeInTheDocument();
  });

  it("should have border radius 50% if type artist", () => {
    expect.assertions(1);

    render(
      <CardContent
        id="id"
        subTitle={<span data-testId="subcomponent">Heey</span>}
        title="title"
        type={CardType.ARTIST}
        images={[{ url: "eer" }] as SpotifyApi.ImageObject[]}
      />
    );

    const mytest = screen.getByRole("img");
    expect(mytest).toHaveStyle({
      borderRadius: "50%",
    });
  });
});
