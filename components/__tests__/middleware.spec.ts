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
      },
      geo: {
        country: "US",
      },
      headers: {
        get: () => "",
      },
      cookies: {
        get: () => ({ value: "ES" }),
      },
    } as unknown as NextRequest;

    jest
      .spyOn(NextResponse, "rewrite")
      .mockReturnValueOnce((() => ({})) as unknown as NextResponse);

    const result = middleware(request);
    expect(result).toBeDefined();
  });
});
