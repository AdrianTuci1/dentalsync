import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Resolve alias imports
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest", // Transform TypeScript files
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Optional for extra config
  testMatch: ["**/tests/**/*.test.ts", "**/tests/**/*.spec.js"]
};

export default config;