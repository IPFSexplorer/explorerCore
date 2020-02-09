module.exports = {
    moduleFileExtensions: ["js", "jsx", "json", "vue", "ts", "tsx", "node"],
    transform: {
        // process *.vue files with vue-jest
        "^.+\\.vue$": require.resolve("vue-jest"),
        ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": require.resolve(
            "jest-transform-stub"
        ),
        "^.+\\.jsx?$": require.resolve("babel-jest"),
        "^.+\\.tsx?$": require.resolve("ts-jest")
    },
    transformIgnorePatterns: ["/node_modules/"],
    // support the same @ -> src alias mapping in source code
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    },
    testEnvironment: "node",
    // serializer for snapshots
    snapshotSerializers: ["jest-serializer-vue"],
    // https://github.com/facebook/jest/issues/6766
    testURL: "http://localhost/",
    watchPlugins: [
        require.resolve("jest-watch-typeahead/filename"),
        require.resolve("jest-watch-typeahead/testname")
    ],
    globals: {
        "ts-jest": {
            babelConfig: true
        }
    },
    testMatch: [
        "**/tests/unit/**/*.spec.[jt]s?(x)",
        "**/__tests__/*.[jt]s?(x)"
    ],
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!src/**/*.d.ts"]
};
