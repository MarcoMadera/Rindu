/* eslint-disable @typescript-eslint/no-var-requires */
const nextJest = require("next/jest");
const { defaults } = require("jest-config");
const { join } = require("path");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  roots: [process.cwd()],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/types/**",
    "!**/.storybook/**",
    "!**/stories/**",
    "!**/pages/**",
    "!**/layouts/**",
    "!**/context/**",
    "!**/*.js",
    "!**/*.mjs",
    "!**/*.stories.tsx",
  ],
  testEnvironment: "jsdom",
  moduleFileExtensions: [
    ...defaults.moduleFileExtensions,
    "ts",
    "tsx",
    "js",
    "json",
    "jsx",
  ],
  moduleNameMapper: {
    "^@/(.*)$": join(process.cwd(), "src", "$1"),
  },
  setupFiles: ["jest-canvas-mock"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["<rootDir>/**/*.(spec|test).(js|jsx|ts|tsx)"],
  moduleDirectories: ["<rootDir>", "node_modules"],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
