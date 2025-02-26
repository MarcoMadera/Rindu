import { ConfigurationManager } from "../configuration/configurationManager";
import type { VersionedConfig } from "types/configuration";

describe("configurationManager", () => {
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: jest.fn((key: string) => store[key]),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  const setupFresh = () => {
    window.documentPictureInPicture =
      {} as unknown as typeof window.documentPictureInPicture;
    ConfigurationManager.resetInstance();
    localStorage.clear();
    jest.clearAllMocks();
    const instance = ConfigurationManager.getInstance();
    instance.reset();

    return instance;
  };

  describe("getInstance", () => {
    it("should return the same instance on multiple calls", () => {
      expect.assertions(1);

      const instance1 = ConfigurationManager.getInstance();
      const instance2 = ConfigurationManager.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("get", () => {
    it("should return default values when no config is stored", () => {
      expect.assertions(3);

      const configurationManager = setupFresh();

      expect(configurationManager.get("isDocPipEnabled")).toBe(false);
      expect(configurationManager.get("theme")).toBe("system");
      expect(configurationManager.get("volume")).toBe(1);
    });

    it("should return stored values when valid", () => {
      expect.assertions(2);

      const configurationManager = setupFresh();

      configurationManager.set("theme", "dark");
      configurationManager.set("volume", 0.5);

      expect(configurationManager.get("theme")).toBe("dark");
      expect(configurationManager.get("volume")).toBe(0.5);
    });
  });

  describe("set", () => {
    it("should store valid values", () => {
      expect.assertions(2);

      const configurationManager = setupFresh();

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      configurationManager.set("theme", "dark");

      expect(configurationManager.get("theme")).toBe("dark");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "app_config",
        JSON.stringify({
          version: 1,
          data: { isDocPipEnabled: false, theme: "dark", volume: 1 },
        })
      );
    });

    it("should not store invalid value", () => {
      expect.assertions(1);

      const configurationManager = setupFresh();

      // @ts-expect-error Testing invalid value
      configurationManager.set("theme", "invalid-theme");

      expect(configurationManager.get("theme")).toBe("system");
    });
  });

  describe("updateMultiple", () => {
    it("should update multiple valid values", () => {
      expect.assertions(3);

      const configurationManager = setupFresh();

      configurationManager.updateMultiple({
        theme: "dark",
        volume: 0.5,
        isDocPipEnabled: false,
      });

      expect(configurationManager.get("theme")).toBe("dark");
      expect(configurationManager.get("volume")).toBe(0.5);
      expect(configurationManager.get("isDocPipEnabled")).toBe(false);
    });

    it("should not stored invalid values", () => {
      expect.assertions(2);

      const configurationManager = setupFresh();

      configurationManager.set("theme", "system");
      configurationManager.set("volume", 1);

      configurationManager.updateMultiple({
        theme: "dark",
        // volume is invalid should be 0 to 1
        volume: 2,
      });

      expect(configurationManager.get("theme")).toBe("dark");
      expect(configurationManager.get("volume")).toBe(1);
    });
  });

  describe("reset", () => {
    it("should reset to default values", () => {
      expect.assertions(3);

      const configurationManager = setupFresh();

      configurationManager.updateMultiple({
        theme: "dark",
        volume: 0.5,
        isDocPipEnabled: false,
      });

      configurationManager.reset();

      expect(configurationManager.get("theme")).toBe("system");
      expect(configurationManager.get("volume")).toBe(1);
      expect(configurationManager.get("isDocPipEnabled")).toBe(false);
    });
  });

  describe("getAll", () => {
    it("should return all config values", () => {
      expect.assertions(1);

      const configurationManager = setupFresh();

      const allConfig = configurationManager.getAll();

      expect(allConfig).toStrictEqual({
        isDocPipEnabled: false,
        theme: "system",
        volume: 1,
      });
    });

    it("should return updated values after changes", () => {
      expect.assertions(1);

      const configurationManager = setupFresh();

      configurationManager.updateMultiple({
        theme: "dark",
        volume: 0.5,
      });

      const allConfig = configurationManager.getAll();

      expect(allConfig).toStrictEqual({
        isDocPipEnabled: false,
        theme: "dark",
        volume: 0.5,
      });
    });
  });

  describe("localStorage interaction", () => {
    it("should handle valid localStorage data", () => {
      expect.assertions(3);

      ConfigurationManager.resetInstance();

      localStorage.setItem(
        "app_config",
        JSON.stringify({
          version: 1,
          data: { isDocPipEnabled: true, theme: "light", volume: 0.7 },
        })
      );

      const instance = ConfigurationManager.getInstance();

      expect(instance.get("theme")).toBe("light");
      expect(instance.get("volume")).toBe(0.7);
      expect(instance.get("isDocPipEnabled")).toBe(true);
    });

    it("should handle corrupted localStorage data", () => {
      expect.assertions(4);

      const error = jest.spyOn(console, "error").mockImplementation(() => {});

      ConfigurationManager.resetInstance();

      localStorage.setItem("app_config", "invalid json");

      const instance = ConfigurationManager.getInstance();

      expect(error).toHaveBeenCalledWith(
        "Error loading configuration:",
        expect.anything()
      );
      expect(instance.get("theme")).toBe("system");
      expect(instance.get("volume")).toBe(1);
      expect(instance.get("isDocPipEnabled")).toBe(false);
    });

    it("should persist values between instances", () => {
      expect.assertions(1);

      const configurationManager = setupFresh();

      configurationManager.set("theme", "dark");

      const newInstance = ConfigurationManager.getInstance();

      expect(newInstance.get("theme")).toBe("dark");
    });

    it("should handle localStorage errors gracefully", () => {
      expect.assertions(1);

      const configurationManager = setupFresh();

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });

      const mockError = new Error("Storage full");
      jest.spyOn(localStorage, "setItem").mockImplementationOnce(() => {
        throw mockError;
      });

      expect(() => {
        configurationManager.set("theme", "dark");
      }).not.toThrow();
    });
  });

  describe("configurationManager migrations", () => {
    it("should handle legacy config without version", () => {
      expect.assertions(4);

      localStorage.setItem(
        "app_config",
        JSON.stringify({
          isDocPipEnabled: false,
          theme: "dark",
          volume: 0.7,
        })
      );

      ConfigurationManager.resetInstance();
      const configManager = ConfigurationManager.getInstance();

      expect(configManager.get("isDocPipEnabled")).toBe(false);
      expect(configManager.get("theme")).toBe("dark");
      expect(configManager.get("volume")).toBe(0.7);

      const savedData = JSON.parse(
        localStorage.getItem("app_config") as string
      ) as VersionedConfig;

      expect(savedData).toStrictEqual({
        version: 1,
        data: {
          isDocPipEnabled: false,
          theme: "dark",
          volume: 0.7,
        },
      });
    });

    it("should handle old version config", () => {
      expect.assertions(4);

      setupFresh();

      localStorage.setItem(
        "app_config",
        JSON.stringify({
          version: 0,
          data: {
            isDocPipEnabled: true,
            theme: "light",
            volume: 0.5,
          },
        })
      );

      ConfigurationManager.resetInstance();
      const configManager = ConfigurationManager.getInstance();

      expect(configManager.get("isDocPipEnabled")).toBe(true);
      expect(configManager.get("theme")).toBe("light");
      expect(configManager.get("volume")).toBe(0.5);

      const savedData = JSON.parse(
        localStorage.getItem("app_config") as string
      ) as VersionedConfig;

      expect(savedData.version).toBe(1);
    });

    it("should handle missing properties in old config", () => {
      expect.assertions(3);

      setupFresh();

      localStorage.setItem(
        "app_config",
        JSON.stringify({
          version: 0,
          data: {
            theme: "light",
            // missing isDocPipEnabled and volume
          },
        })
      );

      ConfigurationManager.resetInstance();
      const configManager = ConfigurationManager.getInstance();

      expect(configManager.get("isDocPipEnabled")).toBe(false); // default value
      expect(configManager.get("volume")).toBe(1); // default value
      expect(configManager.get("theme")).toBe("light"); // preserved value
    });

    it("should handle invalid values in old config", () => {
      expect.assertions(3);

      setupFresh();

      localStorage.clear();
      localStorage.setItem(
        "app_config",
        JSON.stringify({
          version: 0,
          data: {
            isDocPipEnabled: "not a boolean", // invalid
            theme: "invalid-theme", // invalid
            volume: 2, // invalid
          },
        })
      );

      ConfigurationManager.resetInstance();
      const configManager = ConfigurationManager.getInstance();

      expect(configManager.get("isDocPipEnabled")).toBe(false);
      expect(configManager.get("theme")).toBe("system");
      expect(configManager.get("volume")).toBe(1);
    });

    it("should handle partial migrations", () => {
      expect.assertions(2);

      localStorage.setItem(
        "app_config",
        JSON.stringify({
          version: 0,
          data: {
            theme: "dark",
            volume: 0.5,
            // missing isDocPipEnabled
          },
        })
      );
      ConfigurationManager.resetInstance();
      ConfigurationManager.getInstance();

      const savedData = JSON.parse(
        localStorage.getItem("app_config") as string
      ) as VersionedConfig;

      expect(savedData.version).toBe(1);
      expect(savedData.data).toStrictEqual({
        isDocPipEnabled: false, // default value for missing property
        theme: "dark",
        volume: 0.5,
      });
    });
  });
});
