import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { PALETTE_NAME } from "@plugin/constants";
import { startupErrorHtml } from "@plugin/shell";
import { SANDBOX_VERSION } from "@plugin/version";
import { paletteGenerateFixture } from "@shared/wireContract.fixture";

type IncomingMessage = { type: string; payload?: unknown };

function createNodeStub() {
  return {
    width: 100,
    height: 20,
    resize: vi.fn(),
    appendChild: vi.fn(),
    setPluginData: vi.fn(),
    getPluginData: vi.fn(() => ""),
    remove: vi.fn(),
  };
}

function createFigmaStub() {
  return {
    showUI: vi.fn(),
    notify: vi.fn(),
    closePlugin: vi.fn(),
    createFrame: vi.fn(createNodeStub),
    createText: vi.fn(createNodeStub),
    createRectangle: vi.fn(createNodeStub),
    group: vi.fn(createNodeStub),
    loadFontAsync: vi.fn(() => Promise.resolve()),
    ui: {
      onmessage: undefined as ((message: IncomingMessage) => void) | undefined,
      postMessage: vi.fn(),
      resize: vi.fn(),
    },
    clientStorage: {
      getAsync: vi.fn(() => Promise.resolve(undefined)),
      setAsync: vi.fn(() => Promise.resolve()),
    },
    root: { documentColorProfile: "SRGB" },
    currentPage: { findOne: vi.fn(() => null), appendChild: vi.fn(), selection: [] },
    viewport: {
      bounds: { x: 0, y: 0, width: 800, height: 600 },
      scrollAndZoomIntoView: vi.fn(),
    },
    variables: {
      createVariableCollection: vi.fn(() => ({
        variableIds: [],
        modes: [{ modeId: "mode-1", name: "Mode 1" }],
      })),
      getLocalVariableCollectionsAsync: vi.fn(() => Promise.resolve([])),
      getVariableByIdAsync: vi.fn(() => Promise.resolve(null)),
      createVariable: vi.fn((name: string) => ({
        id: `id-${name}`,
        name,
        setValueForMode: vi.fn(),
      })),
    },
  };
}

type FigmaStub = ReturnType<typeof createFigmaStub>;

async function startSandbox(figmaStub: FigmaStub) {
  (globalThis as unknown as { figma: unknown }).figma = figmaStub;
  vi.resetModules();
  await import("./index");
}

function send(figmaStub: FigmaStub, type: string, payload?: unknown) {
  figmaStub.ui.onmessage?.({ type, payload });
}

describe("sandbox", () => {
  let figmaStub: FigmaStub;

  beforeEach(() => {
    figmaStub = createFigmaStub();
  });

  test("draws nothing when the payload fails the wire contract", async () => {
    await startSandbox(figmaStub);

    const payload = paletteGenerateFixture();
    payload.config.settings.bgLightStart = "1" as never;

    send(figmaStub, "palette:generate", payload);
    await vi.waitFor(() => expect(figmaStub.notify).toHaveBeenCalled());

    expect(figmaStub.variables.createVariableCollection).not.toHaveBeenCalled();
    expect(figmaStub.createFrame).not.toHaveBeenCalled();
    expect(figmaStub.closePlugin).not.toHaveBeenCalled();
  });

  test("draws nothing when the payload needs a sandbox newer than this one", async () => {
    await startSandbox(figmaStub);

    send(figmaStub, "palette:generate", {
      ...paletteGenerateFixture(),
      minSandboxVersion: SANDBOX_VERSION + 1,
    });
    await vi.waitFor(() => expect(figmaStub.notify).toHaveBeenCalled());

    expect(figmaStub.variables.createVariableCollection).not.toHaveBeenCalled();
    expect(figmaStub.createFrame).not.toHaveBeenCalled();
  });

  test("draws the palette when the payload satisfies the wire contract", async () => {
    await startSandbox(figmaStub);

    send(figmaStub, "palette:generate", paletteGenerateFixture());
    await vi.waitFor(() => expect(figmaStub.closePlugin).toHaveBeenCalled());

    expect(figmaStub.variables.createVariableCollection).toHaveBeenCalledWith(PALETTE_NAME);
    expect(figmaStub.createFrame).toHaveBeenCalled();
    expect(figmaStub.notify).not.toHaveBeenCalled();
  });

  describe("startup watchdog", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test("keeps watching after the handshake, which the UI sends before it paints", async () => {
      await startSandbox(figmaStub);

      send(figmaStub, "ui:ready");
      figmaStub.showUI.mockClear();
      await vi.runAllTimersAsync();

      expect(figmaStub.showUI).toHaveBeenCalledWith(startupErrorHtml, expect.anything());
    });

    test("stops watching once the UI reports it has painted", async () => {
      await startSandbox(figmaStub);

      send(figmaStub, "ui:ready");
      send(figmaStub, "ui:mounted");
      figmaStub.showUI.mockClear();
      await vi.runAllTimersAsync();

      expect(figmaStub.showUI).not.toHaveBeenCalled();
    });
  });
});
