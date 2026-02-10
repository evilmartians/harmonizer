import { beforeEach, describe, expect, test } from "vitest";

import { resetUiStores } from "./test-utils";
import {
  $isChangingBgBoundary,
  $scrollableContainer,
  setScrollableContainer,
  startChangingBgBoundary,
  stopChangingBgBoundary,
} from "./ui";

describe("ui store", () => {
  beforeEach(() => {
    resetUiStores();
  });

  describe("$scrollableContainer", () => {
    test("initializes as null", () => {
      expect($scrollableContainer.value).toBeNull();
    });
  });

  describe(setScrollableContainer, () => {
    test("sets scrollable container", () => {
      const container = { tagName: "DIV" } as unknown as HTMLDivElement;

      setScrollableContainer(container);

      expect($scrollableContainer.value).toBe(container);
    });

    test("can set to null", () => {
      const container = { tagName: "DIV" } as unknown as HTMLDivElement;

      setScrollableContainer(container);
      setScrollableContainer(null);

      expect($scrollableContainer.value).toBeNull();
    });
  });

  describe("$isChangingBgBoundary", () => {
    test("initializes as false", () => {
      expect($isChangingBgBoundary.value).toBe(false);
    });
  });
  describe(startChangingBgBoundary, () => {
    test("sets $isChangingBgBoundary to true", () => {
      $isChangingBgBoundary.set(false);

      startChangingBgBoundary();

      expect($isChangingBgBoundary.value).toBe(true);
    });
  });

  describe(stopChangingBgBoundary, () => {
    test("sets $isChangingBgBoundary to false", () => {
      startChangingBgBoundary();
      stopChangingBgBoundary();

      expect($isChangingBgBoundary.value).toBe(false);
    });
  });
});
