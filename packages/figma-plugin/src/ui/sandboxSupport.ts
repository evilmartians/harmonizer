/**
 * Oldest sandbox this UI can still talk to. The UI redeploys on every push while the sandbox
 * only changes when the plugin is republished, so the two drift apart. Raise this when a wire
 * change stops being backwards compatible, and adapt older payloads here rather than in the
 * sandbox, which cannot be patched after publish.
 *
 * Checked twice on purpose: once here against the version the handshake reports, and again in
 * the sandbox, which every `palette:generate` payload carries this value to.
 */
export const MIN_SUPPORTED_SANDBOX_VERSION = 1;
