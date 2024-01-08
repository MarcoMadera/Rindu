import { NextApiRequest, NextApiResponse } from "next";

import { IUtilsMocks } from "types/mocks";
import { getAuth } from "utils";
import { getMe, refreshAccessToken } from "utils/spotifyCalls";

jest.mock("utils/spotifyCalls");

const { user, refreshAccessTokenResponse, accessToken, setupCookies } =
  jest.requireActual<IUtilsMocks>("./__mocks__/mocks.ts");

const nextApiResponse = {
  setHeader: jest.fn(),
  writeHead: jest.fn(),
  end: jest.fn(),
} as unknown as NextApiResponse;

const nextApiRequest = {
  cookies: {},
} as unknown as NextApiRequest;

const context = {
  req: nextApiRequest,
  res: nextApiResponse,
};

describe("getAuth", () => {
  it("should return the correct auth", async () => {
    expect.assertions(1);
    setupCookies();
    (getMe as jest.Mock).mockResolvedValue(user);
    const auth = await getAuth(context);
    expect(auth).toStrictEqual({ user, accessToken });
  });

  it("should return the correct auth when refreshAccessToken is null", async () => {
    expect.assertions(1);
    setupCookies();
    (getMe as jest.Mock).mockResolvedValue(null);
    (refreshAccessToken as jest.Mock).mockResolvedValue(null);
    const auth = await getAuth(context);
    expect(auth).toBeNull();
  });

  it("should return the correct auth when user is null", async () => {
    expect.assertions(1);
    setupCookies();
    (getMe as jest.Mock).mockResolvedValue(null);
    (refreshAccessToken as jest.Mock).mockResolvedValue(
      refreshAccessTokenResponse
    );
    const auth = await getAuth(context);
    expect(auth).toBeNull();
  });

  it("should return the correct auth when user is null only one", async () => {
    expect.assertions(1);
    setupCookies();
    (getMe as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(user);
    (refreshAccessToken as jest.Mock).mockResolvedValue(
      refreshAccessTokenResponse
    );
    const auth = await getAuth(context);
    expect(auth).toStrictEqual({ user, accessToken });
  });

  it("should return the correct auth when there is no data", async () => {
    expect.assertions(1);
    setupCookies("");
    (getMe as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    const auth = await getAuth(context);
    expect(auth).toBeNull();
  });
});
