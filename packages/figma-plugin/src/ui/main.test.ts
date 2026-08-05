// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { MIN_SUPPORTED_SANDBOX_VERSION } from "@ui/sandboxSupport";

const { createApp } = vi.hoisted(() => ({ createApp: vi.fn() }));

// The app itself is another package, and mounting it here would test React rather than the
// handshake. Everything else in core stays real, config parsing included.
vi.mock("@harmonizer/core", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@harmonizer/core")>()),
  createApp,
}));

// Core spawns its colour worker at import time, and jsdom has no Worker. Core's own suite
// stands the channel down the same way.
vi.mock("@core/worker/workerChannel", () => ({
  workerChannel: { emit: vi.fn(), on: vi.fn(() => vi.fn()) },
}));

type SentMessage = { type: string; payload?: unknown };

let sent: SentMessage[];

function sentTypes() {
  return sent.map(({ type }) => type);
}

async function loadUi() {
  vi.resetModules();
  await import("./main");
}

/**
 * Delivered to the handler the transport installed, the way Figma's frame delivers one. Going
 * through a real event instead would test jsdom: it keeps `globalThis` and `window` apart, so
 * the assignment the transport makes is not the one an event would reach.
 */
function receiveReady(sandboxVersion = MIN_SUPPORTED_SANDBOX_VERSION) {
  const message = {
    data: {
      pluginMessage: {
        type: "ready",
        payload: { sandboxVersion, sandboxBuild: "test", storedConfig: null, inP3: false },
      },
    },
  } as MessageEvent;

  globalThis.onmessage?.call(window, message);
}

function rootText() {
  return document.querySelector("#root")?.textContent ?? "";
}

describe("plugin UI", () => {
  beforeEach(() => {
    sent = [];
    document.body.innerHTML = '<div id="root"></div>';
    vi.spyOn(window, "postMessage").mockImplementation((message) => {
      sent.push((message as { pluginMessage: SentMessage }).pluginMessage);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    createApp.mockReset();
  });

  test("announces itself as soon as the bundle has parsed", async () => {
    await loadUi();

    expect(sentTypes()).toStrictEqual(["ui:ready"]);
  });

  test("mounts the app and reports that it painted", async () => {
    await loadUi();
    receiveReady();

    await vi.waitFor(() => expect(sentTypes()).toContain("ui:mounted"));
    expect(createApp).toHaveBeenCalledOnce();
  });

  test("explains a sandbox older than it supports, and still reports that it painted", async () => {
    await loadUi();
    receiveReady(MIN_SUPPORTED_SANDBOX_VERSION - 1);

    await vi.waitFor(() => expect(sentTypes()).toContain("ui:mounted"));
    expect(rootText()).toContain("needs a newer version of the plugin");
    expect(createApp).not.toHaveBeenCalled();
  });

  test("reports that it painted even when starting the app failed", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    createApp.mockImplementation(() => {
      throw new Error("mount failed");
    });

    await loadUi();
    receiveReady();

    await vi.waitFor(() => expect(sentTypes()).toContain("ui:mounted"));
    expect(rootText()).toContain("Harmonizer couldn't start");
  });

  test("stays quiet with no mount point, leaving the sandbox watching", async () => {
    document.body.innerHTML = "";

    await loadUi();
    receiveReady();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(sentTypes()).not.toContain("ui:mounted");
  });
});
