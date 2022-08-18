import { NextApiResponse } from "next";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "utils/constants";
import { serverRedirect } from "utils/serverRedirect";

describe("serverRedirect", () => {
  it("should redirect to server", () => {
    expect.assertions(2);
    const serverResponse = {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
    } as unknown as NextApiResponse;
    serverRedirect(serverResponse, "https://example.com");

    expect(serverResponse.setHeader).toHaveBeenCalledWith("Set-Cookie", [
      `${ACCESS_TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
      `${REFRESH_TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`,
    ]);
    expect(serverResponse.writeHead).toHaveBeenCalledWith(307, {
      Location: "https://example.com",
    });
  });
});
