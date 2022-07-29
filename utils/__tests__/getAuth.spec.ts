import { NextApiResponse } from "next";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "utils/constants";
import { getAuth } from "utils/getAuth";
import { getMe } from "utils/spotifyCalls/getMe";
import { refreshAccessToken } from "utils/spotifyCalls/refreshAccessToken";

jest.mock("utils/spotifyCalls/getMe", () => ({
  ...jest.requireActual("utils/spotifyCalls/getMe"),
  getMe: jest.fn(),
}));
jest.mock("utils/serverRedirect", () => ({
  ...jest.requireActual("utils/serverRedirect"),
  serverRedirect: jest.fn(),
}));

jest.mock("utils/spotifyCalls/refreshAccessToken", () => ({
  ...jest.requireActual("utils/spotifyCalls/refreshAccessToken"),
  refreshAccessToken: jest.fn(),
}));

const res = {
  setHeader: jest.fn(),
  writeHead: jest.fn(),
  end: jest.fn(),
} as unknown as NextApiResponse;
const user: SpotifyApi.CurrentUsersProfileResponse = {
  birthdate: "1994-12-05",
  country: "US",
  display_name: "John Doe",
  email: "mail@mail.com",
  external_urls: { spotify: "" },
  product: "premium",
  href: "",
  id: "",
  uri: "",
  type: "user",
};

describe("getAuth", () => {
  it("should return the correct auth", async () => {
    expect.assertions(1);
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `${ACCESS_TOKEN_COOKIE}=32323; max-age=1000; Path=/; SameSite=lax; Secure; ${REFRESH_TOKEN_COOKIE}=refresh; max-age=1000; Path=/; SameSite=lax; Secure;`,
    });
    (getMe as jest.Mock).mockResolvedValue(user);
    const auth = await getAuth(res, "test");
    expect(auth).toStrictEqual({ user, accessToken: "32323" });
  });

  it("should return the correct auth when refreshAccessToken is null", async () => {
    expect.assertions(1);
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `${ACCESS_TOKEN_COOKIE}=32323; max-age=1000; Path=/; SameSite=lax; Secure; ${REFRESH_TOKEN_COOKIE}=refresh; max-age=1000; Path=/; SameSite=lax; Secure;`,
    });
    (getMe as jest.Mock).mockResolvedValue(null);
    (refreshAccessToken as jest.Mock).mockResolvedValue(null);
    const auth = await getAuth(res, "test");
    expect(auth).toBeNull();
  });

  it("should return the correct auth when user is null", async () => {
    expect.assertions(1);
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `${ACCESS_TOKEN_COOKIE}=32323; max-age=1000; Path=/; SameSite=lax; Secure; ${REFRESH_TOKEN_COOKIE}=refresh; max-age=1000; Path=/; SameSite=lax; Secure;`,
    });
    (getMe as jest.Mock).mockResolvedValue(null);
    (refreshAccessToken as jest.Mock).mockResolvedValue({
      access_token: "access_token",
      refresh_token: "refresh_token",
      expires_in: "3600",
    });
    const auth = await getAuth(res, "test");
    expect(auth).toBeNull();
  });

  it("should return the correct auth when user is null only one", async () => {
    expect.assertions(1);
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: `${ACCESS_TOKEN_COOKIE}=32323; max-age=1000; Path=/; SameSite=lax; Secure; ${REFRESH_TOKEN_COOKIE}=refresh; max-age=1000; Path=/; SameSite=lax; Secure;`,
    });
    (getMe as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(user);
    (refreshAccessToken as jest.Mock).mockResolvedValue({
      access_token: "access_token",
      refresh_token: "refresh_token",
      expires_in: "3600",
    });
    const auth = await getAuth(res, "test");
    expect(auth).toStrictEqual({ user, accessToken: "access_token" });
  });

  it("should return the correct auth when there is no data", async () => {
    expect.assertions(1);
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
    (getMe as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    const auth = await getAuth(res, "test");
    expect(auth).toBeNull();
  });
});
