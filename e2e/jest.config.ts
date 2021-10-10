import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  testMatch: ["**/e2e/**/*.test.+(ts|tsx|js|jsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  setupFiles: ["./main.ts"],
  testTimeout: 20000,
  maxConcurrency: 1,
};
export default config;
