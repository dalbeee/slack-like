import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,

    moduleFileExtensions: ["js", "ts"],

    roots: ["."],

    testEnvironment: "node",

    testRegex: "^.*\\.spec\\.(ts|tsx)$",

    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },

    moduleNameMapper: {
      "@src/(.*)": "<rootDir>/src/$1",
    },

    transformIgnorePatterns: ["./node_modules/", "./test/"],

    coverageDirectory: "../coverage",
    // setupFiles: ['./jest.setup.dev

    // 이 설정은 ts-jest 28.0.5 부터 바뀜
    //globals: {
    //  "ts-jest": {
    //    // tsconfig: "./test/tsconfig.json",
    //    isolatedModules: true,
    //  },
    //},
    preset: "ts-jest",
  };
};
