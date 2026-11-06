import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Uniform asset URLs carry their own transform params; next/image is not used.
      "@next/next/no-img-element": "off",
      // Components that only render slots and inline-editable text take `_props`.
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  { ignores: [".next/**", "node_modules/**", "uniform-data/**", "next-env.d.ts"] },
];

export default eslintConfig;
