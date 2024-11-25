import { CURRENT_VERSION, migrations } from "./migrations";
import {
  CONFIGURATION_STORAGE_KEY,
  DEFAULT_CONFIG,
  isValidValue,
  validateConfig,
} from "./schema";
import type { Configuration, VersionedConfig } from "types/configuration";
import { isServer } from "utils/environment";

export class ConfigurationManager {
  private static instance: ConfigurationManager | null = null;
  private config: Configuration = DEFAULT_CONFIG;
  private readonly storageKey = CONFIGURATION_STORAGE_KEY;

  private constructor() {
    if (isServer()) return;
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  public static resetInstance(): void {
    ConfigurationManager.instance = null;
  }

  private loadConfig(): Configuration {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      if (!storedData) {
        return DEFAULT_CONFIG;
      }

      const parsedData = JSON.parse(storedData) as
        | VersionedConfig
        | Configuration
        | null;

      if (parsedData === null || typeof parsedData !== "object") {
        return DEFAULT_CONFIG;
      }

      if (!("version" in parsedData)) {
        const migrated = migrations[0](parsedData);
        this.saveConfig(migrated);
        return migrated;
      }

      if (parsedData.version === CURRENT_VERSION) {
        return validateConfig(parsedData.data);
      }

      const migrationFunc =
        migrations[parsedData.version] || migrations["default"];

      const migrated = migrationFunc(parsedData.data);
      this.saveConfig(migrated);
      return migrated;
    } catch (error) {
      console.error("Error loading configuration:", error);
      return DEFAULT_CONFIG;
    }
  }

  private saveConfig(configToSave = this.config): void {
    try {
      const versionedConfig: VersionedConfig = {
        version: CURRENT_VERSION,
        data: configToSave,
      };
      localStorage.setItem(this.storageKey, JSON.stringify(versionedConfig));
    } catch (error) {
      console.error("Error saving configuration:", error);
    }
  }

  public get<K extends keyof Configuration>(key: K): Configuration[K] {
    if (!isValidValue(key, this.config[key])) {
      console.warn(`Invalid value found for ${key}, returning default value`);
      this.config[key] = DEFAULT_CONFIG[key];
      this.saveConfig();
    }
    return this.config[key];
  }

  public set<K extends keyof Configuration>(
    key: K,
    value: Configuration[K]
  ): void {
    const newConfig = {
      ...this.config,
      [key]: value,
    };

    this.config = validateConfig(newConfig);
    this.saveConfig();
  }

  public reset(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
  }

  public getAll(): Readonly<Configuration> {
    return { ...this.config };
  }

  public updateMultiple(updates: Partial<Configuration>): void {
    const newConfig = {
      ...this.config,
      ...updates,
    };

    this.config = validateConfig(newConfig);
    this.saveConfig();
  }

  public static getDefaultValue<K extends keyof Configuration>(
    key: K
  ): Configuration[K] {
    return DEFAULT_CONFIG[key];
  }

  public getVersion(): number {
    return CURRENT_VERSION;
  }
}

export const configuration = ConfigurationManager.getInstance();

export default ConfigurationManager;
