import { IUtilsMocks } from "types/mocks";
import { baseUrl, isServer } from "utils/environment";

jest.mock<typeof import("utils/environment")>("utils/environment", () => ({
  ...jest.requireActual("utils/environment"),
  baseUrl: "https://rindu.marcomadera.com",
  env: "production",
}));

const { setupEnvironment } = jest.requireActual<IUtilsMocks>(
  "./__mocks__/mocks.ts"
);

describe("environment", () => {
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

  describe("baseUrl", () => {
    it("should be equal to the production url", () => {
      expect.assertions(1);

      setupEnvironment({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://rindu.marcomadera.com",
      });

      expect(baseUrl).toBe("https://rindu.marcomadera.com");
    });
  });
});
