import { fixupPluginRules } from "@eslint/compat";
import figmaPlugin from "@figma/eslint-plugin-figma-plugins";
import hideoo from "@hideoo/eslint-config";

export default hideoo(
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    },
  },
  {
    ignores: ["!packages/figma-plugin/**"],
    plugins: {
      figma: fixupPluginRules(figmaPlugin),
    },
    rules: {
      "unicorn/prefer-dom-node-append": "off",
    },
  },
);
