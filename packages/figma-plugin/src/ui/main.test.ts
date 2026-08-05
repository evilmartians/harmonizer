// @vitest-environment jsdom
import { createElement, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { MIN_SUPPORTED_SANDBOX_VERSION } from "@ui/sandboxSupport";

type CreateAppOptions = {
  customUI?: { afterGridContent?: ReactNode };
  onRenderError?: (error: unknown) => void;
};

const { createApp } = vi.hoisted(() => ({
  createApp: vi.fn<(root: HTMLElement, dependencies: unknown, options: CreateAppOptions) => void>(),
}));

// The app itself is another package, and mounting the whole of it here would test core rather
// than the handshake. What the stand-in keeps is the part under test: a real React root, so
// the mounted signal has to survive the same commit the real one does. Everything else in core
// stays real, config parsing included.
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

function settle() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("plugin UI", () => {
  beforeEach(() => {
    sent = [];
    document.body.innerHTML = '<div id="root"></div>';
    createApp.mockImplementation((root, _dependencies, { customUI, onRenderError }) => {
      createRoot(root, onRenderError && { onUncaughtError: onRenderError }).render(
        customUI?.afterGridContent,
      );
    });
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

  test("leaves the sandbox watching when the app never reaches the screen", async () => {
    // `createRoot().render()` returns before React commits, so a mount that got that far and
    // no further is exactly the blank window the watchdog is there to replace.
    createApp.mockImplementation(() => {});

    await loadUi();
    receiveReady();
    await settle();

    expect(sentTypes()).not.toContain("ui:mounted");
  });

  test("explains a render that threw without waiting for the sandbox to notice", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    createApp.mockImplementation((root, _dependencies, { onRenderError }) => {
      createRoot(root, onRenderError && { onUncaughtError: onRenderError }).render(
        createElement(function Boom(): ReactNode {
          throw new Error("render failed");
        }),
      );
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
    await settle();

    expect(sentTypes()).not.toContain("ui:mounted");
  });
});
