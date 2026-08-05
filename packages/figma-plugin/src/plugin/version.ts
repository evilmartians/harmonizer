/**
 * The sandbox is frozen at publish time while the UI redeploys on every push, so the two can
 * drift. The sandbox reports these in the `ready` message and the UI adapts to them.
 *
 * Bump SANDBOX_VERSION when publishing a new plugin version to Figma, not on every commit.
 *
 * These live under src/plugin (not src/shared) on purpose: the UI must never read its own copy,
 * only the values it receives over the wire. Its own copy describes the build it was compiled
 * from, not the sandbox the user actually has installed.
 */
export const SANDBOX_VERSION = 1;

export const SANDBOX_BUILD = __SANDBOX_BUILD__;
