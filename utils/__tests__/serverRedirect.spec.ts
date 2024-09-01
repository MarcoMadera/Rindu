import { NextApiResponse } from "next";

import { serverRedirect } from "utils/serverRedirect";

describe("serverRedirect", () => {
  it("should redirect to server", () => {
    expect.assertions(1);

    const serverResponse = {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as NextApiResponse;
    serverRedirect(serverResponse, "https://example.com");

    expect(serverResponse.writeHead).toHaveBeenCalledWith(307, {
      Location: "https://example.com",
    });
  });
});
