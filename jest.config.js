module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  },
  moduleNameMapper: {
    "\\.(scss|css)$": "<rootDir>/__mocks__/styleMock.js"
  }
};
