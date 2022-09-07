module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  moduleNameMapper: {
    '^@libs(.*)$': '<rootDir>/src/libs$1',
    '^@functions(.*)$': '<rootDir>/src/functions$1',
    '^@constants(.*)$': '<rootDir>/src/constants$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts',
    '!src/**/config.ts',
    '!src/**/schema.ts',
    '!src/**/constants.ts',
    '!src/libs/types/*',
    '!src/microservice.ts'
  ],
};
