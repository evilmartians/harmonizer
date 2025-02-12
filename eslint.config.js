import hideoo from "@hideoo/eslint-config";

export default hideoo({
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-assertions": "off",
  },
});
