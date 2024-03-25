/**
 * @jest-environment node
 */

import { NextRequest, NextResponse } from "next/server";

import { middleware } from "../../middleware";

describe("middleware", () => {
  it("should return a NextResponse", () => {
    expect.assertions(1);
    const request = {
      nextUrl: {
        searchParams: {
          set: () => "",
        },
        pathname: "/dashboard",
      },
      geo: {
        country: "US",
      },
      headers: {
        get: () => "",
      },
      cookies: {
        get: () => ({ value: "ES" }),
        set: () => {},
      },
    } as unknown as NextRequest;

    jest
      .spyOn(NextResponse, "rewrite")
      .mockReturnValueOnce((() => ({})) as unknown as NextResponse);

    const result = middleware(request);
    expect(result).toBeDefined();
  });

  it("should return a NextResponse in api", () => {
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
        get: () => ({ value: "ES" }),
        set: () => {},
      },
    } as unknown as NextRequest;

    jest
      .spyOn(NextResponse, "rewrite")
      .mockReturnValueOnce((() => ({})) as unknown as NextResponse);

    const result = middleware(request);
    expect(result).toBeDefined();
  });
});
