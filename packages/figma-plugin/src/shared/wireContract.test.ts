import { describe, expect, test } from "vitest";

import { checkPaletteGenerateData } from "./wireContract";
import { FIXTURE_MIN_SANDBOX_VERSION, paletteGenerateFixture } from "./wireContract.fixture";

const CURRENT_SANDBOX = FIXTURE_MIN_SANDBOX_VERSION;

describe(checkPaletteGenerateData, () => {
  test("rejects a field that kept its name but changed type", () => {
    const payload = paletteGenerateFixture();
    payload.config.settings.bgLightStart = "1" as never;

    expect(checkPaletteGenerateData(payload, CURRENT_SANDBOX).status).toBe("invalid");
  });

  test("accepts fields a newer UI added and hands them on untouched", () => {
    const payload = {
      ...paletteGenerateFixture(),
      config: { ...paletteGenerateFixture().config, tintMode: "auto" },
    };
    const result = checkPaletteGenerateData(payload, CURRENT_SANDBOX);

    expect(result.status).toBe("supported");
    expect(result).toHaveProperty("data", payload);
  });

  test("accepts a payload this sandbox exactly meets", () => {
    const payload = { ...paletteGenerateFixture(), minSandboxVersion: 4 };

    expect(checkPaletteGenerateData(payload, 4).status).toBe("supported");
  });

  test("reports a sandbox too old for the payload rather than calling it malformed", () => {
    const payload = { ...paletteGenerateFixture(), minSandboxVersion: 5, colors: "moved" };

    expect(checkPaletteGenerateData(payload, 4)).toStrictEqual({
      status: "unsupported-sandbox",
      minSandboxVersion: 5,
    });
  });

  test("rejects a colour channel Figma would refuse", () => {
    const payload = paletteGenerateFixture();
    payload.colors["0-0"] = { r: 0, g: 0.5, b: 1.5 };

    expect(checkPaletteGenerateData(payload, CURRENT_SANDBOX).status).toBe("invalid");
  });

  test("rejects an unbounded background colour", () => {
    const payload = { ...paletteGenerateFixture(), bgColorLeft: { r: 0, g: 0, b: -Infinity } };

    expect(checkPaletteGenerateData(payload, CURRENT_SANDBOX).status).toBe("invalid");
  });

  test("rejects a background split reaching past the levels it indexes", () => {
    const payload = paletteGenerateFixture();
    payload.config.settings.bgLightStart = payload.config.levels.length + 1;

    expect(checkPaletteGenerateData(payload, CURRENT_SANDBOX).status).toBe("invalid");
  });

  test("rejects a payload missing a colour the grid needs", () => {
    const payload = paletteGenerateFixture();
    payload.config.hues.push({ name: "blue", angle: 260 });

    expect(checkPaletteGenerateData(payload, CURRENT_SANDBOX).status).toBe("invalid");
  });

  test("rejects a payload that names no sandbox requirement at all", () => {
    const { minSandboxVersion: _minSandboxVersion, ...payload } = paletteGenerateFixture();

    expect(checkPaletteGenerateData(payload, CURRENT_SANDBOX).status).toBe("invalid");
  });
});
