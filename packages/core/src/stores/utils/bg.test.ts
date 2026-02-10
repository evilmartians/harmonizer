import { describe, expect, test } from "vitest";

import { BgRightStart } from "@core/types";

import { getBgValueLeft, getBgValueRight, isSingleBgLeft, isSingleBgRight } from "./bg";

describe(isSingleBgLeft, () => {
  test("returns true when bgRightStart equals levelsCount and levelsCount > 0", () => {
    expect(isSingleBgLeft(BgRightStart(1), 1)).toBe(true);
    expect(isSingleBgLeft(BgRightStart(3), 3)).toBe(true);
    expect(isSingleBgLeft(BgRightStart(5), 5)).toBe(true);
  });

  test("returns false when bgRightStart does not equal levelsCount", () => {
    expect(isSingleBgLeft(BgRightStart(1), 7)).toBe(false);
    expect(isSingleBgLeft(BgRightStart(3), 7)).toBe(false);
    expect(isSingleBgLeft(BgRightStart(5), 7)).toBe(false);
  });

  test("returns false when levelsCount is 0 even if bgRightStart is 0", () => {
    expect(isSingleBgLeft(BgRightStart(0), 0)).toBe(false);
  });
});

describe(isSingleBgRight, () => {
  test("returns true when bgRightStart is 0", () => {
    expect(isSingleBgRight(BgRightStart(0))).toBe(true);
  });

  test("returns false when bgRightStart is not 0", () => {
    expect(isSingleBgRight(BgRightStart(1))).toBe(false);
    expect(isSingleBgRight(BgRightStart(3))).toBe(false);
    expect(isSingleBgRight(BgRightStart(7))).toBe(false);
  });
});

describe(getBgValueLeft, () => {
  test("returns rightValue when isSingleRight is true", () => {
    expect(getBgValueLeft(true, "left", "right")).toBe("right");
    expect(getBgValueLeft(true, 1, 2)).toBe(2);
    expect(getBgValueLeft(true, { a: 1 }, { b: 2 })).toEqual({ b: 2 });
  });

  test("returns leftValue when isSingleRight is false", () => {
    expect(getBgValueLeft(false, "left", "right")).toBe("left");
    expect(getBgValueLeft(false, 1, 2)).toBe(1);
    expect(getBgValueLeft(false, { a: 1 }, { b: 2 })).toEqual({ a: 1 });
  });
});

describe(getBgValueRight, () => {
  test("returns leftValue when isSingleLeft is true", () => {
    expect(getBgValueRight(true, "left", "right")).toBe("left");
    expect(getBgValueRight(true, 1, 2)).toBe(1);
    expect(getBgValueRight(true, { a: 1 }, { b: 2 })).toEqual({ a: 1 });
  });

  test("returns rightValue when isSingleLeft is false", () => {
    expect(getBgValueRight(false, "left", "right")).toBe("right");
    expect(getBgValueRight(false, 1, 2)).toBe(2);
    expect(getBgValueRight(false, { a: 1 }, { b: 2 })).toEqual({ b: 2 });
  });
});
