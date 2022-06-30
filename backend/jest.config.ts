import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    moduleFileExtensions: ['js', 'ts'],
    roots: ['.'],
    testEnvironment: 'node',
    testRegex: '^.*\\.spec\\.(ts)$',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
      '@src/(.*)': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: ['./node_modules/', './test/'],
    coverageDirectory: '../coverage',

    preset: 'ts-jest',
  };
};
