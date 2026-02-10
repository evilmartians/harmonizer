import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { defaultConfig } from "@core/defaultConfig";
import {
  BgRightStart,
  ChromaMode,
  ColorSpace,
  ColorString,
  ContrastModel,
  DirectionMode,
  LevelContrast,
} from "@core/types";
import { apcaToWcag } from "@core/utils/colors/apcaToWcag";
import { wcagToApca } from "@core/utils/colors/wcagToApca";

import { levelsStore } from "./colors";
import {
  $bgColorLeft,
  $bgColorModeLeft,
  $bgColorModeRight,
  $bgColorRight,
  $bgColorSingleBgColorType,
  $bgColorSingleBgMode,
  $bgColorSingleStore,
  $bgRightStart,
  $isSingleBgLeft,
  $isSingleBgRight,
  bgColorLeftStore,
  bgColorRightStore,
  chromaModeStore,
  colorSpaceStore,
  contrastModelStore,
  directionModeStore,
  enableDualBg,
  toggleColorSpace,
  toggleContrastModel,
  toggleDirectionMode,
  updateBgColorLeft,
  updateBgColorRight,
  updateBgColorSingle,
  updateBgRightStart,
  updateBgRightStartByOffset,
  updateChromaMode,
  updateContrastModel,
  updateDirectionMode,
} from "./settings";
import {
  addTestLevels,
  cleanupFakeTimersAndRAF,
  createTestLevelStore,
  expectColorsRecalculation,
  resetStores,
  setupFakeTimersAndRAF,
} from "./test-utils";

describe("settings stores", () => {
  beforeEach(() => {
    resetStores();
  });

  describe("stores initialization", () => {
    test("contrastModelStore initializes with default value", () => {
      expect(contrastModelStore.$lastValidValue.value).toBe(defaultConfig.settings.contrastModel);
    });

    test("contrastModelStore validates values", () => {
      contrastModelStore.$raw.set(ContrastModel("wcag"));
      expect(contrastModelStore.$lastValidValue.value).toBe("wcag");

      contrastModelStore.$raw.set(ContrastModel("apca"));
      expect(contrastModelStore.$lastValidValue.value).toBe("apca");

      contrastModelStore.$raw.set("invalid" as ContrastModel);
      expect(contrastModelStore.$raw.value).toBe("invalid");
      expect(contrastModelStore.$lastValidValue.value).toBe("apca");
    });

    test("directionModeStore initializes with default value", () => {
      expect(directionModeStore.$lastValidValue.value).toBe(defaultConfig.settings.directionMode);
    });

    test("chromaModeStore initializes with default value", () => {
      expect(chromaModeStore.$lastValidValue.value).toBe(defaultConfig.settings.chromaMode);
    });

    test("colorSpaceStore initializes with default value", () => {
      expect(colorSpaceStore.$lastValidValue.value).toBe(defaultConfig.settings.colorSpace);
    });

    test("bgColorLeftStore and bgColorRightStore initialize with default values", () => {
      expect(bgColorLeftStore.$lastValidValue.value).toBe(defaultConfig.settings.bgColorDark);
      expect(bgColorRightStore.$lastValidValue.value).toBe(defaultConfig.settings.bgColorLight);
    });
  });

  describe("derived background signals", () => {
    describe("$isSingleBgLeft", () => {
      test("returns true when bgRightStart equals levelsCount", () => {
        addTestLevels("100", "200");
        $bgRightStart.set(BgRightStart(2));

        expect($isSingleBgLeft.value).toBe(true);
      });

      test("returns false when bgRightStart does not equal levelsCount", () => {
        addTestLevels("100", "200");
        $bgRightStart.set(BgRightStart(1));

        expect($isSingleBgLeft.value).toBe(false);
      });
    });

    describe("$isSingleBgRight", () => {
      test("returns true when bgRightStart is 0", () => {
        $bgRightStart.set(BgRightStart(0));

        expect($isSingleBgRight.value).toBe(true);
      });

      test("returns false when bgRightStart is not 0", () => {
        $bgRightStart.set(BgRightStart(1));

        expect($isSingleBgRight.value).toBe(false);
      });
    });

    describe("$bgColorLeft", () => {
      test("returns bgColorLeft when not single right mode", () => {
        $bgRightStart.set(BgRightStart(1));
        bgColorLeftStore.$raw.set(ColorString("#333"));
        bgColorRightStore.$raw.set(ColorString("#ccc"));

        expect($bgColorLeft.value).toBe("#333");
      });

      test("returns bgColorRight when single right mode", () => {
        $bgRightStart.set(BgRightStart(0));
        bgColorLeftStore.$raw.set(ColorString("#333"));
        bgColorRightStore.$raw.set(ColorString("#ccc"));

        expect($bgColorLeft.value).toBe("#ccc");
      });
    });

    describe("$bgColorRight", () => {
      test("returns bgColorRight when not single left mode", () => {
        addTestLevels("100");
        $bgRightStart.set(BgRightStart(0));
        bgColorLeftStore.$raw.set(ColorString("#333"));
        bgColorRightStore.$raw.set(ColorString("#ccc"));

        expect($bgColorRight.value).toBe("#ccc");
      });

      test("returns bgColorLeft when single left mode", () => {
        addTestLevels("100");
        $bgRightStart.set(BgRightStart(1));
        bgColorLeftStore.$raw.set(ColorString("#333"));
        bgColorRightStore.$raw.set(ColorString("#ccc"));

        expect($bgColorRight.value).toBe("#333");
      });
    });

    describe("$bgColorModeLeft", () => {
      test("derives bg mode from left color", () => {
        bgColorLeftStore.$raw.set(ColorString("#333"));

        expect($bgColorModeLeft.value).toBe("dark");
      });

      test("returns light for light colors", () => {
        bgColorLeftStore.$raw.set(ColorString("#ccc"));
        $bgRightStart.set(BgRightStart(1));

        expect($bgColorModeLeft.value).toBe("light");
      });
    });

    describe("$bgColorModeRight", () => {
      test("derives bg mode from right color", () => {
        bgColorRightStore.$raw.set(ColorString("#ccc"));

        expect($bgColorModeRight.value).toBe("light");
      });

      test("returns dark for dark colors", () => {
        addTestLevels("100");
        bgColorRightStore.$raw.set(ColorString("#333"));
        $bgRightStart.set(BgRightStart(0));

        expect($bgColorModeRight.value).toBe("dark");
      });
    });

    describe("$bgColorSingleBgColorType", () => {
      test("returns 'right' when single right mode", () => {
        $bgRightStart.set(BgRightStart(0));

        expect($bgColorSingleBgColorType.value).toBe("right");
      });

      test("returns 'left' when not single right mode", () => {
        $bgRightStart.set(BgRightStart(1));

        expect($bgColorSingleBgColorType.value).toBe("left");
      });
    });

    describe("$bgColorSingleStore", () => {
      test("returns bgColorLeftStore when not single right mode", () => {
        $bgRightStart.set(BgRightStart(1));

        expect($bgColorSingleStore.value).toBe(bgColorLeftStore);
      });

      test("returns bgColorRightStore when single right mode", () => {
        $bgRightStart.set(BgRightStart(0));

        expect($bgColorSingleStore.value).toBe(bgColorRightStore);
      });
    });

    describe("$bgColorSingleBgMode", () => {
      test("returns dark mode for dark single color", () => {
        $bgRightStart.set(BgRightStart(1));
        bgColorLeftStore.$raw.set(ColorString("#333"));

        expect($bgColorSingleBgMode.value).toBe("dark");
      });

      test("returns light mode for light single color", () => {
        $bgRightStart.set(BgRightStart(0));
        bgColorRightStore.$raw.set(ColorString("#ccc"));

        expect($bgColorSingleBgMode.value).toBe("light");
      });
    });
  });
});

describe("settings update and toggle functions", () => {
  beforeEach(() => {
    resetStores();
    setupFakeTimersAndRAF();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanupFakeTimersAndRAF();
  });

  describe(updateContrastModel, () => {
    test("updates contrast model store and triggers recalculation", () => {
      updateContrastModel(ContrastModel("wcag"));

      expect(contrastModelStore.$lastValidValue.value).toBe("wcag");
      expectColorsRecalculation({ contrastModel: "wcag" });
    });

    test("converts all level contrasts from APCA to WCAG", () => {
      const level1 = createTestLevelStore({ name: "100", contrast: 100 });
      const level2 = createTestLevelStore({ name: "200", contrast: 50 });
      levelsStore.addItem(level1);
      levelsStore.addItem(level2);

      expect(contrastModelStore.$lastValidValue.value).toBe("apca");
      updateContrastModel(ContrastModel("wcag"));

      expect(level1.contrast.$raw.value).toBe(LevelContrast(apcaToWcag(100)));
      expect(level2.contrast.$raw.value).toBe(LevelContrast(apcaToWcag(50)));
    });

    test("converts all level contrasts from WCAG to APCA", () => {
      contrastModelStore.$raw.set(ContrastModel("wcag"));
      const level1 = createTestLevelStore({ name: "100", contrast: 21 });
      const level2 = createTestLevelStore({ name: "200", contrast: 4.5 });
      levelsStore.addItem(level1);
      levelsStore.addItem(level2);

      expect(contrastModelStore.$lastValidValue.value).toBe("wcag");
      updateContrastModel(ContrastModel("apca"));

      expect(level1.contrast.$raw.value).toBe(LevelContrast(wcagToApca(21)));
      expect(level2.contrast.$raw.value).toBe(LevelContrast(wcagToApca(4.5)));
    });
  });

  describe(updateDirectionMode, () => {
    test("updates direction mode and triggers recalculation", () => {
      expect(directionModeStore.$lastValidValue.value).toBe("fgToBg");
      updateDirectionMode(DirectionMode("bgToFg"));

      expect(directionModeStore.$lastValidValue.value).toBe("bgToFg");
      expectColorsRecalculation({ directionMode: "bgToFg" });
    });
  });

  describe(updateChromaMode, () => {
    test("updates chroma mode and triggers recalculation", () => {
      expect(chromaModeStore.$lastValidValue.value).toBe("even");
      updateChromaMode(ChromaMode("max"));

      expect(chromaModeStore.$lastValidValue.value).toBe("max");
      expectColorsRecalculation({ chromaMode: "max" });
    });
  });

  describe(updateBgColorLeft, () => {
    test("updates left background color and triggers recalculation", () => {
      updateBgColorLeft(ColorString("#222"));

      expect(bgColorLeftStore.$lastValidValue.value).toBe("#222");
      expectColorsRecalculation({ bgColorLeft: "#222" });
    });
  });

  describe(updateBgColorRight, () => {
    test("updates right background color and triggers recalculation", () => {
      updateBgColorRight(ColorString("#eee"));

      expect(bgColorRightStore.$lastValidValue.value).toBe("#eee");
      expectColorsRecalculation({ bgColorRight: "#eee" });
    });
  });

  describe(updateBgColorSingle, () => {
    test("updates left color when in single left mode", () => {
      addTestLevels("100");
      $bgRightStart.set(BgRightStart(1));
      expect($isSingleBgLeft.value).toBe(true);

      updateBgColorSingle(ColorString("#333"));

      expect(bgColorLeftStore.$lastValidValue.value).toBe("#333");
    });

    test("updates right color when in single right mode", () => {
      $bgRightStart.set(BgRightStart(0));
      expect($isSingleBgRight.value).toBe(true);

      updateBgColorSingle(ColorString("#ccc"));
      expect(bgColorRightStore.$lastValidValue.value).toBe("#ccc");
    });
  });

  describe(updateBgRightStart, () => {
    test("returns false when value unchanged", () => {
      addTestLevels("100", "200");
      $bgRightStart.set(BgRightStart(2));

      const changed = updateBgRightStart(BgRightStart(2));

      expect(changed).toBe(false);
      expect($bgRightStart.value).toBe(2);
    });

    test("returns true and updates when value changed", () => {
      addTestLevels("100", "200", "300");
      $bgRightStart.set(BgRightStart(1));

      const changed = updateBgRightStart(BgRightStart(2));

      expect(changed).toBe(true);
      expect($bgRightStart.value).toBe(2);
    });

    test("clamps to 0 minimum", () => {
      $bgRightStart.set(BgRightStart(2));

      const changed = updateBgRightStart(BgRightStart(-5));

      expect(changed).toBe(true);
      expect($bgRightStart.value).toBe(0);
    });

    test("clamps to levels count maximum", () => {
      addTestLevels("100", "200");

      const changed = updateBgRightStart(BgRightStart(100));

      expect(changed).toBe(true);
      expect($bgRightStart.value).toBe(2);
    });
  });

  describe(updateBgRightStartByOffset, () => {
    test("shifts bgRightStart by positive offset", () => {
      addTestLevels("100", "200", "300");
      $bgRightStart.set(BgRightStart(1));

      const changed = updateBgRightStartByOffset(1);

      expect(changed).toBe(true);
      expect($bgRightStart.value).toBe(2);
    });

    test("shifts bgRightStart by negative offset", () => {
      addTestLevels("100", "200");
      $bgRightStart.set(BgRightStart(2));

      const changed = updateBgRightStartByOffset(-1);

      expect(changed).toBe(true);
      expect($bgRightStart.value).toBe(1);
    });
  });

  describe(enableDualBg, () => {
    test("sets bgRightStart to middle of levels", () => {
      addTestLevels("100", "200", "300", "400");
      $bgRightStart.set(BgRightStart(0));

      enableDualBg();

      expect($bgRightStart.value).toBe(2);
    });

    test("handles odd number of levels", () => {
      addTestLevels("100", "200", "300");
      $bgRightStart.set(BgRightStart(0));

      enableDualBg();

      expect($bgRightStart.value).toBe(1);
    });

    test("sets bgRightStart to 0 with 0 levels", () => {
      $bgRightStart.set(BgRightStart(0));

      enableDualBg();

      expect($bgRightStart.value).toBe(0);
    });

    test("sets bgRightStart to 0 with 1 level", () => {
      addTestLevels("100");
      $bgRightStart.set(BgRightStart(0));

      enableDualBg();

      expect($bgRightStart.value).toBe(0);
    });
  });

  describe("updateBgRightStart edge cases", () => {
    test("clamps to 0 with 0 levels", () => {
      $bgRightStart.set(BgRightStart(0));

      const changed = updateBgRightStart(BgRightStart(5));

      expect(changed).toBe(false);
      expect($bgRightStart.value).toBe(0);
    });
  });

  describe(toggleContrastModel, () => {
    test("toggles from APCA to WCAG and forces fgToBg mode", () => {
      contrastModelStore.$raw.set(ContrastModel("apca"));
      directionModeStore.$raw.set(DirectionMode("bgToFg"));

      toggleContrastModel();

      expect(contrastModelStore.$lastValidValue.value).toBe("wcag");
      expect(directionModeStore.$lastValidValue.value).toBe("fgToBg");
      expectColorsRecalculation({ contrastModel: "wcag" });
    });

    test("toggles from WCAG to APCA without changing direction mode", () => {
      contrastModelStore.$raw.set(ContrastModel("wcag"));
      directionModeStore.$raw.set(DirectionMode("fgToBg"));

      toggleContrastModel();

      expect(contrastModelStore.$lastValidValue.value).toBe("apca");
      expect(directionModeStore.$lastValidValue.value).toBe("fgToBg");
      expectColorsRecalculation({ contrastModel: "apca" });
    });
  });

  describe(toggleDirectionMode, () => {
    test("toggles from fgToBg to bgToFg", () => {
      directionModeStore.$raw.set(DirectionMode("fgToBg"));

      toggleDirectionMode();

      expect(directionModeStore.$lastValidValue.value).toBe("bgToFg");
      expectColorsRecalculation({ directionMode: "bgToFg" });
    });

    test("toggles from bgToFg to fgToBg", () => {
      directionModeStore.$raw.set(DirectionMode("bgToFg"));

      toggleDirectionMode();

      expect(directionModeStore.$lastValidValue.value).toBe("fgToBg");
      expectColorsRecalculation({ directionMode: "fgToBg" });
    });
  });

  describe(toggleColorSpace, () => {
    test("toggles from p3 to srgb", () => {
      colorSpaceStore.$raw.set(ColorSpace("p3"));

      toggleColorSpace();

      expect(colorSpaceStore.$lastValidValue.value).toBe("srgb");
      expectColorsRecalculation({ colorSpace: "srgb" });
    });

    test("toggles from srgb to p3", () => {
      colorSpaceStore.$raw.set(ColorSpace("srgb"));

      toggleColorSpace();

      expect(colorSpaceStore.$lastValidValue.value).toBe("p3");
      expectColorsRecalculation({ colorSpace: "p3" });
    });
  });
});
