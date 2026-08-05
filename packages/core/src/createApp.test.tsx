// @vitest-environment jsdom
import { beforeEach, describe, expect, test, vi } from "vitest";

import { createApp } from "./createApp";
import { getDefaultConfigCopy } from "./defaultConfig";
import { parseExportConfig } from "./schemas/exportConfig";

function Boom(): never {
  throw new Error("render failed");
}

function settle() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe(createApp, () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  test("hands a render error to the caller instead of only rethrowing it", async () => {
    const onRenderError = vi.fn();
    const element = document.createElement("div");
    const config = await parseExportConfig(getDefaultConfigCopy());

    createApp(
      element,
      { config, lockColorSpace: false },
      { customUI: { actions: <Boom /> }, onRenderError },
    );
    await settle();

    expect(onRenderError).toHaveBeenCalledOnce();
    // React discards the tree it could not finish, so nothing is left for the caller to work
    // around when it puts its own message here.
    expect(element.innerHTML).toBe("");
  });
});
