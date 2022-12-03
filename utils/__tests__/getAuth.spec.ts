import { NextApiResponse } from "next";
import { IUtilsMocks } from "types/mocks";
import { getAuth } from "utils/getAuth";
import { getMe } from "utils/spotifyCalls/getMe";
import { refreshAccessToken } from "utils/spotifyCalls/refreshAccessToken";

jest.mock(
  "utils/spotifyCalls/getMe",
  () =>
    ({
      ...jest.requireActual("utils/spotifyCalls/getMe"),
      getMe: jest.fn(),
    } as IUtilsMocks)
);
jest.mock(
  "utils/serverRedirect",
  () =>
    ({
      ...jest.requireActual("utils/serverRedirect"),
      serverRedirect: jest.fn(),
    } as IUtilsMocks)
);

jest.mock(
  "utils/spotifyCalls/refreshAccessToken",
  () =>
    ({
      ...jest.requireActual("utils/spotifyCalls/refreshAccessToken"),
      refreshAccessToken: jest.fn(),
    } as IUtilsMocks)
);

const { user, refreshAccessTokenResponse, accessToken, setupCookies } =
  jest.requireActual<IUtilsMocks>("./__mocks__/mocks.ts");

const nextApiResponse = {
  setHeader: jest.fn(),
  writeHead: jest.fn(),
  end: jest.fn(),
} as unknown as NextApiResponse;

describe("getAuth", () => {
  it("should return the correct auth", async () => {
    expect.assertions(1);
    setupCookies();
    (getMe as jest.Mock).mockResolvedValue(user);
    const auth = await getAuth(nextApiResponse, "test");
    expect(auth).toStrictEqual({ user, accessToken });
  });

  it("should return the correct auth when refreshAccessToken is null", async () => {
    expect.assertions(1);
    setupCookies();
    (getMe as jest.Mock).mockResolvedValue(null);
    (refreshAccessToken as jest.Mock).mockResolvedValue(null);
    const auth = await getAuth(nextApiResponse, "test");
    expect(auth).toBeNull();
  });

  it("should return the correct auth when user is null", async () => {
    expect.assertions(1);
    setupCookies();
    (getMe as jest.Mock).mockResolvedValue(null);
    (refreshAccessToken as jest.Mock).mockResolvedValue(
      refreshAccessTokenResponse
    );
    const auth = await getAuth(nextApiResponse, "test");
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
    const auth = await getAuth(nextApiResponse, "test");
    expect(auth).toStrictEqual({ user, accessToken });
  });

  it("should return the correct auth when there is no data", async () => {
    expect.assertions(1);
    setupCookies("");
    (getMe as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    const auth = await getAuth(nextApiResponse, "test");
    expect(auth).toBeNull();
  });
});
