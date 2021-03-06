module.exports = {
    root: true,
    env: {
        node: true
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        indent: "off",
        "@typescript-eslint/indent": ["error", 4]
    },
    parserOptions: {
        parser: "@typescript-eslint/parser"
    },
    overrides: [{
        files: [
            "**/__tests__/*.{j,t}s?(x)",
            "**/tests/unit/**/*.spec.{j,t}s?(x)"
        ],
        env: {
            jest: true
        }
    }]
};