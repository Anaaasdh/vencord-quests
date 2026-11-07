/*!
 * Questcord, a Vencord plugin that automates Discord Quests
 
 * Copyright (c) 2026 Anasdh
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        ignores: [
            "dist/",
            "node_modules/",
            "index.js",
            "constants.js",
            "constants.test.js",
            "settings.js",
            "core/*.js",
            "quests/*.js",
            "ui/*.js",
            "components/*.js",
        ],
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",

            "@typescript-eslint/no-unused-vars": "warn",

            "no-empty": ["error", { allowEmptyCatch: true }],

            "@typescript-eslint/no-require-imports": "off",

            "no-ex-assign": "off",

            "prefer-const": "off",

            "preserve-caught-error": "off",
        },
    }
);
