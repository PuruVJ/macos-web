module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@__/(.*)$': '<rootDir>/src/$1',
  },
};
