import { beforeEach, describe, expect, test, vi } from "vitest";

import { HueId, LevelId } from "@core/types";

import { appEvents } from "./appEvents";

describe("appEvents pattern", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("levelAdded event", () => {
    test("emits and receives levelAdded event", () => {
      const listener = vi.fn();
      const unsubscribe = appEvents.on("levelAdded", listener);
      const levelId = LevelId("test-level-id");

      appEvents.emit("levelAdded", levelId);

      expect(listener).toHaveBeenCalledWith(levelId);
      unsubscribe();
    });

    test("unsubscribe stops receiving events", () => {
      const listener = vi.fn();
      const unsubscribe = appEvents.on("levelAdded", listener);

      unsubscribe();
      appEvents.emit("levelAdded", LevelId("test-level-id"));

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("hueAdded event", () => {
    test("emits and receives hueAdded event", () => {
      const listener = vi.fn();
      const unsubscribe = appEvents.on("hueAdded", listener);
      const hueId = HueId("test-hue-id");

      appEvents.emit("hueAdded", hueId);

      expect(listener).toHaveBeenCalledWith(hueId);
      unsubscribe();
    });

    test("multiple listeners receive the same event", () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const unsubscribe1 = appEvents.on("hueAdded", listener1);
      const unsubscribe2 = appEvents.on("hueAdded", listener2);
      const hueId = HueId("test-hue-id");

      appEvents.emit("hueAdded", hueId);

      expect(listener1).toHaveBeenCalledWith(hueId);
      expect(listener2).toHaveBeenCalledWith(hueId);

      unsubscribe1();
      unsubscribe2();
    });
  });
});
