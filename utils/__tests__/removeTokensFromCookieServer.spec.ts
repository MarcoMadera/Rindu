import { NextPageContext } from "next";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "utils/constants";
import { removeTokensFromCookieServer } from "utils/removeTokensFromCookieServer";

describe("removeTokensFromCookieServer", () => {
  it("should remove tokens from cookie", () => {
    expect.assertions(1);
    const serverResponse = {
      setHeader: jest.fn(),
    };
    removeTokensFromCookieServer(
      serverResponse as unknown as NextPageContext["res"]
    );
    expect(serverResponse?.setHeader).toHaveBeenCalledWith("Set-Cookie", [
      `${ACCESS_TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`,
      `${REFRESH_TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`,
      `${EXPIRE_TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`,
    ]);
  });
});
