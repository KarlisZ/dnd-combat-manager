module.exports = {
    root: true,
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "import",
        "@typescript-eslint/eslint-plugin",
    ],
    "settings": {
        "react": {
            "version": "17.0.2",
        },
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
    },
    "rules": {
        "semi": "error",
        "comma-dangle": ["error", "always-multiline"],
        "no-console": "error",
        "max-len": ["error", {
            "code": 150,
            "comments": 0,
            "ignorePattern": `^import |//|"[^"]{100,}"`,
        }],
        "eqeqeq": ["error", "smart"],

        "no-undef": "off", // ensured by TypeScript
        "no-unused-vars": "off", // ensured by TypeScript
        "no-case-declarations": "off",
        "no-empty": ["error", {
                "allowEmptyCatch": true,
            },
        ],
        "no-prototype-builtins": "off", // we don't use `Object.create`
        "no-dupe-class-members": "off", // ensured by TypeScript
        "no-new": "error",
        "no-bitwise": "error",
        "no-shadow": "error",
        "guard-for-in": "error",
        "no-irregular-whitespace": ["error", { skipStrings: false }],
        "keyword-spacing": "error",
        "quotes": ["error", "double", { "allowTemplateLiterals": true, "avoidEscape": true }],
        "no-control-regex": "off",
        "no-extra-boolean-cast": "off",
        "object-curly-spacing": ["error", "always"],
        "space-infix-ops": "error",
        "eol-last": "error",
        "no-trailing-spaces": "error",
        "no-var": "error",
        "no-multiple-empty-lines": ["error", { "max": 1, maxBOF: 0 }],
        "camelcase": ["warn", { "properties": "never", "ignoreDestructuring": true }],

        // @typescript-eslint
        "@typescript-eslint/triple-slash-reference": ["error", { "path": "never", "types": "never", "lib": "never" }],
        "@typescript-eslint/member-delimiter-style": ["error", {
            multiline: {
                requireLast: true,
                delimiter: "semi",
            },
            singleline: {
                requireLast: true,
                delimiter: "semi",
            },
        }],
        "@typescript-eslint/no-this-alias": ["error"],
        "@typescript-eslint/prefer-for-of": ["error"],
        "@typescript-eslint/no-unused-expressions": ["error", { allowTernary: true }],
        "@typescript-eslint/naming-convention": ["error", {
            selector: "variableLike",
            format: ["PascalCase", "camelCase", "UPPER_CASE"],
        }],
        "@typescript-eslint/no-namespace": ["error"],
        "@typescript-eslint/explicit-member-accessibility": ["error", {
            accessibility: "explicit",
            overrides: {
                constructors: "off",
            },
        }],

        // "import" plugin
        "import/no-default-export": "warn",
        "import/no-unassigned-import": ["error", { "allow": ["react", "**/*.pcss"] }],

        // "react" plugin
        "react/prop-types": "off",
        "react/no-find-dom-node": "off",
        "react/display-name": "off",
        "react/jsx-no-bind": ["error"],
        "react/no-children-prop": "off",
        "react/react-in-jsx-scope": "off",
    },
};
