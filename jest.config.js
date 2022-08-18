// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  roots: ["<rootDir>"],
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
  ],
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "json", "jsx"],
  setupFiles: ["jest-canvas-mock"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/?(*.)+(test|spec).[jt]s?(x)"],
  moduleDirectories: ["<rootDir>", "node_modules"],
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 15,
      lines: 15,
      statements: 15,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
