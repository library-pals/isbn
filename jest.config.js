const config = {
  resetMocks: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  transform: {},
  prettierPath: "<rootDir>/node_modules/prettier-2/index.js",
  testPathIgnorePatterns: ["/examples/"],
};

export default config;
