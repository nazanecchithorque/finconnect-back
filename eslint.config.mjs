// eslint.config.mjs
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
    {
        files: ["**/*.ts"],

        languageOptions: {
            parser: tsparser,
            sourceType: "module"
        },

        plugins: {
            "@typescript-eslint": tseslint,
            prettier: prettierPlugin
        },

        rules: {
            ...tseslint.configs.recommended.rules,
            ...prettierConfig.rules,
            "@typescript-eslint/no-unused-vars": "warn",
            "no-console": "warn",
            semi: ["error", "always"],
            quotes: ["error", "double"],
            "prettier/prettier": "error",
            // convenciones de nombres
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: ["variable", "function", "parameter", "property"],
                    format: ["camelCase"],
                    leadingUnderscore: "allow"
                },
                // Tipos, clases e interfaces: PascalCase (empieza mayúscula)
                {
                    selector: ["typeLike"],
                    format: ["PascalCase"]
                }
            ]
        }
    }
];
