// https://www.figma.com/plugin-docs/manifest/
//
// The UI is served from the web app's domain instead of being bundled, so shipping a UI change
// is a deploy rather than a Figma publish. Everything here is frozen until the next publish --
// allowedDomains especially, since hosting is static and there is no proxy to route new hosts
// through, so adding a domain later costs a republish.
const figmaManifest = {
  name: "Harmonizer",
  id: "1483474069475958506",
  api: "1.0.0",
  main: "plugin.js",
  capabilities: [],
  enableProposedApi: false,
  documentAccess: "dynamic-page",
  editorType: ["figma"],
  networkAccess: {
    allowedDomains: [
      "https://harmonizer.evilmartians.com", // plugin UI
      "https://cdn.evilmartians.com", // Martian Grotesk / Martian Mono
    ],
    devAllowedDomains: [
      "http://localhost:5174", // plugin UI dev server
      "http://localhost:5173", // web app dev server, for "Open in web app"
    ],
    reasoning:
      "Harmonizer loads its interface from harmonizer.evilmartians.com and its fonts from " +
      "cdn.evilmartians.com, so improvements reach you without reinstalling the plugin. " +
      "Your palettes stay in your document and are never uploaded.",
  },
};

export default figmaManifest;
