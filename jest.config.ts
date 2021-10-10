import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  testMatch: ["**/test/**/*.test.+(ts|tsx|js|jsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  setupFiles: ["./test/main.ts"],
};
export default config;
