/** @type {import('stylelint').Config} */
const config = {
  extends: [
    "stylelint-config-html",
    "stylelint-config-standard",
    "stylelint-config-css-modules",
    "stylelint-config-clean-order",
  ],
  plugins: ["stylelint-order"],
  rules: {
    "import-notation": null,
    "selector-class-pattern": /^([a-z][a-zA-Z0-9]*|[a-z]+_[a-zA-Z0-9]+)$/,
    "at-rule-no-unknown": [true, { ignoreAtRules: ["source", "theme"] }],
    "value-keyword-case": null,
    "custom-property-pattern": null,
  },
};

export default config;
