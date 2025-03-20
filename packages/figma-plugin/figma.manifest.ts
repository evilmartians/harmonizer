// https://www.figma.com/plugin-docs/manifest/
const figmaManifest = {
  name: "Harmonizer",
  id: "1483474069475958506",
  api: "1.0.0",
  main: "plugin.js",
  capabilities: [],
  enableProposedApi: false,
  documentAccess: "dynamic-page",
  editorType: ["figma"],
  ui: "index.html",
  networkAccess: {
    allowedDomains: ["https://cdn.evilmartians.com"],
  },
};

export default figmaManifest;
