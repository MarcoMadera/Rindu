import { IUtilsMocks } from "types/mocks";
import { isProduction, isServer, getSiteUrl } from "utils/enviroment";

const { setupEnviroment } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("enviroment", () => {
  describe("isProduction", () => {
    it("should be falsy if is not production", () => {
      expect.assertions(1);

      expect(isProduction()).toBeFalsy();
    });

    it("should be truthy if is production", () => {
      expect.assertions(1);
      setupEnviroment({
        NODE_ENV: "production",
      });

      expect(isProduction()).toBeTruthy();
    });
  });

  describe("isServer", () => {
    it("should be falsy if is not server", () => {
      expect.assertions(1);

      expect(isServer()).toBeFalsy();
    });

    it("should be truthy if is server", () => {
      expect.assertions(1);
      Object.defineProperty(window, "document", {
        writable: true,
        value: undefined,
      });

      expect(isServer()).toBeTruthy();
    });
  });

  describe("getSiteUrl", () => {
    it("should be equal to the development url", () => {
      expect.assertions(1);
      setupEnviroment({
        NODE_ENV: "development",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      });

      expect(getSiteUrl()).toBe("http://localhost:3000");
    });

    it("should be equal to the production url", () => {
      expect.assertions(1);
      setupEnviroment({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://rindu.marcomadera.com",
      });

      expect(getSiteUrl()).toBe("https://rindu.marcomadera.com");
    });
  });
});
