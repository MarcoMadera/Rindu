/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from "next/server";

import { middleware } from "../../middleware";
import { Locale, LOCALE_COOKIE } from "utils";

describe("middleware", () => {
  it("should redirect and set locale cookie if is not there", () => {
    expect.assertions(2);
    const nextUrl = {
      searchParams: {
        set: () => "",
      },
      pathname: "/dashboard",
    };

    const request = {
      url: "myUrl",
      nextUrl,
      geo: {
        country: "US",
      },
      headers: {
        get: () => "",
      },
      cookies: {
        get: () => ({
          value: undefined,
        }),
        set: () => {},
      },
    } as unknown as NextRequest;
    const setCookies = jest.fn();
    const redirection = jest.spyOn(NextResponse, "redirect").mockReturnValue({
      cookies: { set: setCookies },
    } as unknown as NextResponse);

    middleware(request);
    expect(setCookies).toHaveBeenCalledWith(LOCALE_COOKIE, Locale.EN);
    expect(redirection).toHaveBeenCalledWith(nextUrl);
  });

  it("should not return a NextResponse in api if locale cookie is present", () => {
    expect.assertions(1);
    const request = {
      nextUrl: {
        searchParams: {
          set: () => "",
        },
        pathname: "/api/top-tracks-cover",
      },
      geo: {
        country: "US",
      },
      headers: {
        get: () => "",
      },
      cookies: {
        get: () => ({
          value: Locale.EN,
        }),
        set: () => {},
      },
    } as unknown as NextRequest;

    jest
      .spyOn(NextResponse, "rewrite")
      .mockReturnValueOnce((() => ({})) as unknown as NextResponse);

    const result = middleware(request);
    expect(result).toBeUndefined();
  });
});
