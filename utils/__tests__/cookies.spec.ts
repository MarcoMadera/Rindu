import { IUtilsMocks } from "types/mocks";
import {
  ACCESS_TOKEN_COOKIE,
  EXPIRE_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "utils/constants";
import { makeCookie, takeCookie, eatCookie } from "utils/cookies";

const { setupCookies } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("cookies", () => {
  it("should set a cookie", () => {
    expect.assertions(1);
    const value = "testValue";
    setupCookies("");
    makeCookie({ name: ACCESS_TOKEN_COOKIE, value, age: 1000 });
    expect(document.cookie).toBe(
      `${ACCESS_TOKEN_COOKIE}=${value}; max-age=1000; Path=/; SameSite=lax; Secure;`
    );
  });

  it("should remove a cookie", () => {
    expect.assertions(1);
    setupCookies("");
    const value = "testValue";
    makeCookie({ name: REFRESH_TOKEN_COOKIE, value, age: 1000 });
    eatCookie(REFRESH_TOKEN_COOKIE);
    const cookie = takeCookie(REFRESH_TOKEN_COOKIE);
    expect(cookie).toBeNull();
  });

  it("should return null if cookie is not found", () => {
    expect.assertions(1);
    Object.defineProperty(window, "document", {
      writable: true,
      value: undefined,
    });
    const cookie = takeCookie(EXPIRE_TOKEN_COOKIE);
    expect(cookie).toBeNull();
  });

  it("should return null if cookieValue is not found", () => {
    expect.assertions(1);
    Object.defineProperty(window, "document", {
      writable: true,
      value: undefined,
    });
    const cookie = takeCookie("testCookie", "; testCookie=");
    expect(cookie).toBeNull();
  });
});
