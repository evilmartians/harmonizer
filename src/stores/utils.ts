import { signal, type SignalOptions, type WritableSignal, Signal } from "@spred/core";
import { maxChroma, type ChromaFunction, type ColorSpace } from "apcach";
import { shallowEqual } from "fast-equals";

import { getClosestColorName } from "./colorNames";
import { FALLBACK_HUE_TINT_COLOR, FALLBACK_LEVEL_TINT_COLOR } from "./constants";
import type {
  ChromaLevel,
  ChromaMode,
  ColorCellData,
  ColorHueTintData,
  ColorIdentifier,
  ColorLevelTintData,
  ColorString,
  ContrastLevel,
  Hue,
  HueAngle,
  HueData,
  HueId,
  Level,
  LevelData,
  LevelId,
  LightnessLevel,
} from "./types";

import {
  apcachToCss,
  calculateApcach,
  getMiddleContrastLevel,
  getMiddleHueAngle,
  inColorSpace,
} from "@/utils/color";
import { getRandomId } from "@/utils/id";
import { invariant } from "@/utils/invariant";
import { getMiddleValue } from "@/utils/misc";
import type { PartialOptional } from "@/utils/types";

export type AnyId = string;
export type ItemWithId<Id extends string> = { id: Id; [key: string]: unknown };
export type WithReactiveFields<Obj extends Record<string, unknown>, Fields extends keyof Obj> = {
  [F in keyof Obj as F extends Fields ? `$${F & string}` : F]: F extends Fields
    ? WritableSignal<Obj[F]>
    : Obj[F];
};

export function withId<Id extends string, Item extends ItemWithId<Id>>(
  data: Omit<Item, "id">,
): Item {
  return { ...data, id: getRandomId() } as Item;
}

type IndexedStore<Item extends ItemWithId<AnyId>> = {
  $ids: WritableSignal<Item["id"][]>;
  items: Map<Item["id"], Item>;
  getItem: (id: Item["id"]) => Item;
  addItem: (item: Item, at?: number) => void;
  removeItem: (id: Item["id"]) => void;
  overwrite: (items: Item[]) => void;
};

export function createIndexedArrayStore<Item extends ItemWithId<AnyId>>(
  initialItems: Item[],
): IndexedStore<Item> {
  const mapEntries = (items: Item[]) => items.map((item) => [item.id, item] as const);
  const mapIds = (items: Item[]) => items.map((item) => item.id);

  const $ids = signal(mapIds(initialItems));
  const items = new Map<Item["id"], Item>(mapEntries(initialItems));
  const addItem = (item: Item, at?: number) => {
    items.set(item.id, item);
    $ids.set($ids.value.toSpliced(at ?? $ids.value.length, 0, item.id));
  };
  const getItem = (id: Item["id"]) => {
    const item = items.get(id);

    invariant(item, `Item with id ${id} not found`);

    return item;
  };
  const removeItem = (id: Item["id"]) => {
    items.delete(id);
    $ids.set($ids.value.filter((itemId) => itemId !== id));
  };
  const overwrite = (newItems: Item[]) => {
    items.clear();
    for (const [key, value] of mapEntries(newItems)) {
      items.set(key, value);
    }
    $ids.set(mapIds(newItems));
  };

  return { $ids, items, addItem, getItem, removeItem, overwrite };
}

export function getColorSignal<T>(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  initial: Exclude<T, Function>,
  options?: Omit<SignalOptions<T>, "equal">,
): WritableSignal<T> {
  return signal(initial, { ...options, equal: shallowEqual });
}

export function getColorIdentifier(levelId: LevelId, hueId: HueId): ColorIdentifier {
  return `${levelId}-${hueId}`;
}

export function matchesLevelColorKey(colorKey: ColorIdentifier, levelId: LevelId): boolean {
  return colorKey.startsWith(levelId);
}

export function matchesHueColorKey(colorKey: ColorIdentifier, hueId: HueId): boolean {
  return colorKey.endsWith(hueId);
}

function getMiddleLevelName(lowerName: string, upperName: string): string {
  const prevName = Number.parseInt(lowerName, 10);
  const nextName = Number.parseInt(upperName, 10);

  return !Number.isNaN(prevName) && !Number.isNaN(nextName)
    ? String(getMiddleValue(prevName, nextName))
    : lowerName;
}

export function getMiddleLevel(
  lowerLevelStore: LevelStore,
  upperLevelStore: LevelStore,
): LevelStore {
  return cloneStore(lowerLevelStore, {
    $name: signal(getMiddleLevelName(lowerLevelStore.$name.value, upperLevelStore.$name.value)),
    $contrast: signal(
      getMiddleContrastLevel(lowerLevelStore.$contrast.value, upperLevelStore.$contrast.value),
    ),
  });
}

export function getMiddleHue(hueStore1: HueStore, hueStore2: HueStore): HueStore {
  const middleHueAngle = getMiddleHueAngle(hueStore1.$angle.value, hueStore2.$angle.value);

  return cloneStore(hueStore1, {
    $name: signal(getClosestColorName(middleHueAngle)),
    $angle: signal(middleHueAngle),
  });
}

export function cloneStore<Item extends ItemWithId<AnyId>>(
  store: Item,
  overrides?: Partial<Item>,
): Item {
  const clonedStore: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(store)) {
    if (overrides && key in overrides) {
      clonedStore[key] = overrides[key];
    } else {
      clonedStore[key] = value instanceof Signal ? signal(value.value) : value;
    }
  }

  return withId(clonedStore as Item);
}

type GetCloneItemOptions<
  MainItem extends ItemWithId<AnyId>,
  CrossItem extends ItemWithId<AnyId>,
> = {
  main: IndexedStore<MainItem>;
  cross: IndexedStore<CrossItem>;
  getNewItem: () => MainItem;
  getMiddleItem: (previous: MainItem, next: MainItem) => MainItem;
  onAddColor: (id: MainItem["id"], crossId: CrossItem["id"], previousId?: MainItem["id"]) => void;
  onFinish: (id?: MainItem["id"]) => void;
};
export function getInsertItem<
  MainItem extends ItemWithId<AnyId>,
  CrossItem extends ItemWithId<AnyId>,
>({
  main,
  cross,
  onAddColor,
  getNewItem,
  getMiddleItem,
  onFinish,
}: GetCloneItemOptions<MainItem, CrossItem>) {
  return (afterId?: MainItem["id"]) => {
    const previousIndex = afterId ? main.$ids.value.indexOf(afterId) : main.$ids.value.length - 1;
    const previousId = main.$ids.value[previousIndex];
    const nextId = main.$ids.value[previousIndex + 1];

    let newItem = getNewItem();

    if (previousId && nextId) {
      newItem = getMiddleItem(main.getItem(previousId), main.getItem(nextId));
    } else if (previousId) {
      newItem = cloneStore(main.getItem(previousId));
    }

    for (const oppositeId of cross.$ids.value) {
      onAddColor(newItem.id, oppositeId, previousId);
    }
    main.addItem(newItem, previousIndex + 1);
    onFinish(previousId);
  };
}

export function cleanupColors<Id extends AnyId>(
  colorsMap: Map<ColorIdentifier, WritableSignal<ColorCellData>>,
  predicate: (identifier: ColorIdentifier, id: Id) => boolean,
  id: Id,
) {
  // Cleanup dropped colors to prevent memory leaks
  for (const identifier of colorsMap.keys()) {
    if (predicate(identifier, id)) {
      colorsMap.delete(identifier);
    }
  }
}

export type LevelStore = WithReactiveFields<Level, "name" | "contrast" | "chroma" | "tintColor">;
export function getLevelStore(data: PartialOptional<LevelData, "tintColor">): LevelStore {
  return withId({
    $name: signal(data.name),
    $contrast: signal(data.contrast),
    $chroma: signal(data.chroma),
    $tintColor: getColorSignal(data.tintColor ?? FALLBACK_LEVEL_TINT_COLOR),
  });
}

export type HueStore = WithReactiveFields<Hue, "name" | "angle" | "tintColor">;
export function getHueStore(data: PartialOptional<HueData, "tintColor">): HueStore {
  return withId({
    $name: signal(data.name),
    $angle: signal(data.angle),
    $tintColor: getColorSignal(data.tintColor ?? FALLBACK_HUE_TINT_COLOR),
  });
}

// TODO: move to color utils after refactoring
type MaxCommonChromaOptions = {
  colorSpace: ColorSpace;
  bgColor: ColorString;
  contrastLevel: ContrastLevel;
  hueAngles: HueAngle[];
};

export function maxCommonChroma({
  colorSpace,
  bgColor,
  contrastLevel,
  hueAngles,
}: MaxCommonChromaOptions): number {
  let maxCommonChroma = 100;

  for (const hueAngle of hueAngles) {
    const apcachColor = calculateApcach(bgColor, contrastLevel, maxChroma(), hueAngle, colorSpace);
    if (apcachColor.chroma < maxCommonChroma) {
      maxCommonChroma = apcachColor.chroma;
    }
  }
  return maxCommonChroma;
}

type ColorCellOptions = {
  colorSpace: ColorSpace;
  bgColor: ColorString;
  contrastLevel: ContrastLevel;
  chroma: ChromaFunction | number;
  hueAngle: HueAngle;
};

export function calculateColorCell({
  colorSpace,
  bgColor,
  contrastLevel,
  hueAngle,
  chroma,
}: ColorCellOptions): ColorCellData {
  const apcachColor = calculateApcach(bgColor, contrastLevel, chroma, hueAngle, colorSpace);

  return {
    cr: contrastLevel,
    l: <LightnessLevel>apcachColor.lightness,
    c: <ChromaLevel>apcachColor.chroma,
    h: hueAngle,
    p3: !inColorSpace(apcachColor, "srgb"),
    css: <ColorString>apcachToCss(apcachColor),
  };
}

export type GenerateColorsPayload = {
  levels: { id: LevelId; contrast: ContrastLevel }[];
  onlyLevelId: LevelId | undefined;
  hues: { id: HueId; angle: HueAngle }[];
  bgColorLight: ColorString;
  bgColorDark: ColorString;
  bgLightLevel: number;
  chromaMode: ChromaMode;
  colorSpace: ColorSpace;
};

const HUE_TINT_CR = <ContrastLevel>80;
const HUE_TINT_CHROMA = <ChromaLevel>0.05;
const MIN_LEVEL_TINT_CR = <ContrastLevel>50;

export type GeneratedCellPayload = {
  type: "cell";
  levelId: LevelId;
  hueId: HueId;
  color: ColorCellData;
};
export type GeneratedLevelTintPayload = {
  type: "level-tint";
  levelId: LevelId;
  color: ColorLevelTintData;
};
export type GeneratedHueTintPayload = {
  type: "hue-tint";
  hueId: HueId;
  color: ColorHueTintData;
};

export type GeneratedColorPayload =
  | GeneratedCellPayload
  | GeneratedLevelTintPayload
  | GeneratedHueTintPayload;

export function calculateColors(
  {
    levels,
    onlyLevelId,
    hues,
    bgColorLight,
    bgColorDark,
    bgLightStart,
    chromaMode,
    colorSpace,
  }: GenerateColorsPayload,
  onGeneratedColor: (payload: GeneratedColorPayload) => void,
) {
  for (const [levelIndex, level] of levels.entries()) {
    const bgColor = bgLightLevel <= levelIndex ? bgColorLight : bgColorDark;
    const chroma =
      chromaMode === "even"
        ? maxCommonChroma({
            contrastLevel: level.contrast,
            hueAngles: hues.map((hue) => hue.angle),
            colorSpace,
            bgColor,
          })
        : maxChroma();

    // Calculate hue tint based only on the 0 index level
    if (levelIndex === 0) {
      for (const hue of hues.values()) {
        const hueTintColor = calculateColorCell({
          hueAngle: hue.angle,
          colorSpace,
          bgColor: bgColorDark,
          contrastLevel: HUE_TINT_CR,
          chroma: HUE_TINT_CHROMA,
        });
        onGeneratedColor({ type: "hue-tint", hueId: hue.id, color: hueTintColor });
      }
    }

    if (onlyLevelId && level.id !== onlyLevelId) {
      continue;
    }

    // Reset level tint color when there are no hue rows
    if (hues.length === 0) {
      onGeneratedColor({
        type: "level-tint",
        levelId: level.id,
        color: {
          ...calculateColorCell({
            hueAngle: <HueAngle>0,
            colorSpace,
            bgColor,
            contrastLevel: MIN_LEVEL_TINT_CR,
            chroma: <ChromaLevel>0,
          }),
          referencedC: <ChromaLevel>0,
        },
      });
    }

    for (const [hueIndex, hue] of hues.entries()) {
      const cellColor = calculateColorCell({
        hueAngle: hue.angle,
        colorSpace,
        bgColor,
        contrastLevel: level.contrast,
        chroma,
      });
      onGeneratedColor({ type: "cell", levelId: level.id, hueId: hue.id, color: cellColor });

      // Calculate level tint based only on the first hue row
      if (hueIndex === 0) {
        let levelTintColor: ColorLevelTintData = { ...cellColor, referencedC: cellColor.c };

        if (levelTintColor.cr < MIN_LEVEL_TINT_CR) {
          levelTintColor = {
            ...calculateColorCell({
              hueAngle: hue.angle,
              colorSpace,
              bgColor,
              contrastLevel: MIN_LEVEL_TINT_CR,
              chroma,
            }),
            referencedC: cellColor.c,
          };
        }

        onGeneratedColor({ type: "level-tint", levelId: level.id, color: levelTintColor });
      }
    }
  }
}
