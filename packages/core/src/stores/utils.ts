import { type Signal, signal, type SignalOptions, type WritableSignal } from "@spred/core";
import { shallowEqual } from "fast-equals";
import type { BaseIssue, BaseSchema } from "valibot";
import * as v from "valibot";

import {
  CONTRAST_MIN,
  getContrastMaxLevel,
  getContrastStep,
  getLevelContrastModel,
  HUE_MAX_ANGLE,
  HUE_MIN_ANGLE,
  hueAngleSchema,
  hueNameSchema,
  levelChromaSchema,
  levelChromaCapSchema,
  levelNameSchema,
} from "@core/schemas/color";
import {
  type ColorCellData,
  type ColorHueTintData,
  type ColorIdentifier,
  type ColorLevelTintData,
  HueAngle,
  type HueData,
  HueId,
  HueName,
  type LevelChroma,
  LevelContrast,
  type LevelData,
  LevelId,
  LevelName,
} from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";
import { getClosestColorName } from "@core/utils/colors/getClosestColorName";
import { id } from "@core/utils/random/id";
import {
  getInsertionDataProducer,
  type StoreProducerRules,
} from "@core/utils/stores/getNewItemInserter";
import { type ValidationStore, validationStore } from "@core/utils/stores/validationStore";
import type { PartialOptional } from "@core/utils/ts/generics";

import { huesStore, levelsStore } from "./colors";
import {
  FALLBACK_HUE_DATA,
  FALLBACK_HUE_TINT_COLOR,
  FALLBACK_LEVEL_DATA,
  FALLBACK_LEVEL_TINT_COLOR,
} from "./constants";
import { contrastModelStore } from "./settings";

export type AnyId = string;
export type ItemWithId<Id extends string> = { id: Id; [key: string]: unknown };

type IndexedStore<Item extends ItemWithId<AnyId>> = {
  $ids: WritableSignal<Item["id"][]>;
  $idsToIndex: Signal<Record<Item["id"], number>>;
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
  const $idsToIndex = signal(
    (get) =>
      Object.fromEntries(get($ids).map((id, index) => [id, index])) as Record<Item["id"], number>,
  );
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

  return { $ids, $idsToIndex, items, addItem, getItem, removeItem, overwrite };
}

export function getColorSignal<T>(
  // oxlint-disable-next-line typescript/no-unsafe-function-type
  initial: Exclude<T, Function>,
  options?: Omit<SignalOptions<T>, "equal">,
): WritableSignal<T> {
  return signal(initial, { ...options, equal: shallowEqual });
}

export function getColorIdentifier(levelId: LevelId, hueId: HueId): ColorIdentifier {
  return `${levelId}-${hueId}`;
}

export function matchesLevelColorKey(colorKey: ColorIdentifier, levelId: LevelId): boolean {
  return colorKey.startsWith(`${levelId}-`);
}

export function matchesHueColorKey(colorKey: ColorIdentifier, hueId: HueId): boolean {
  return colorKey.endsWith(`-${hueId}`);
}

export const getLevelInsertionDataProducer = getInsertionDataProducer<
  StoreProducerRules<LevelStore>
>({
  name: { min: 0, step: 100, forceStep: true },
  contrast: {
    min: CONTRAST_MIN,
    max: () => getContrastMaxLevel(contrastModelStore.$lastValidValue.value),
    step: () => getContrastStep(contrastModelStore.$lastValidValue.value) * 5,
  },
});

export function getNewInsertingLevel(insertAt: number, levels: LevelStore[]) {
  const newData = getLevelInsertionDataProducer(insertAt, levels);
  const newLevelData = { ...FALLBACK_LEVEL_DATA };

  if (newData.name) Object.assign(newLevelData, { name: LevelName(String(newData.name)) });
  if (newData.contrast) Object.assign(newLevelData, { contrast: LevelContrast(newData.contrast) });

  return getLevelStore(newLevelData);
}

export const getHueInsertionDataProducer = getInsertionDataProducer({
  angle: { min: HUE_MIN_ANGLE, max: HUE_MAX_ANGLE, step: 10 },
});

export function getNewInsertingHue(insertAt: number, hues: HueStore[]) {
  const newData = getHueInsertionDataProducer(insertAt, hues);
  const newHueData = { ...FALLBACK_HUE_DATA };

  if (newData.angle) {
    const hueAngle = HueAngle(newData.angle);

    Object.assign(newHueData, {
      angle: hueAngle,
      name: HueName(getClosestColorName(hueAngle)),
    });
  }

  return getHueStore(newHueData);
}

type GetInsertMethodOptions<
  MainItem extends ItemWithId<AnyId>,
  CrossItem extends ItemWithId<AnyId>,
> = {
  main: IndexedStore<MainItem>;
  cross: IndexedStore<CrossItem>;
  getNewItem: (insertAt: number, items: MainItem[]) => MainItem;
  onAddColor: (id: MainItem["id"], crossId: CrossItem["id"], previousId?: MainItem["id"]) => void;
  onFinish: (id: MainItem["id"]) => void;
};
export function getInsertMethod<
  MainItem extends ItemWithId<AnyId>,
  CrossItem extends ItemWithId<AnyId>,
>({ main, cross, onAddColor, getNewItem, onFinish }: GetInsertMethodOptions<MainItem, CrossItem>) {
  return (beforeId?: MainItem["id"]) => {
    const nextIndex = beforeId ? main.$ids.value.indexOf(beforeId) : main.$ids.value.length;
    const previousId = main.$ids.value[nextIndex - 1];
    const newItem = getNewItem(
      nextIndex,
      main.$ids.value.map((id) => main.getItem(id)),
    );

    for (const oppositeId of cross.$ids.value) {
      onAddColor(newItem.id, oppositeId, previousId);
    }

    main.addItem(newItem, nextIndex);
    onFinish(newItem.id);
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

export function getNameValidationSchemaSignal<
  Id extends AnyId,
  Name extends string,
  Item extends { id: Id; name: ValidationStore<string, Name> },
>(id: Id, nameSchema: BaseSchema<string, Name, BaseIssue<unknown>>, store: IndexedStore<Item>) {
  return signal((get) =>
    v.pipe(
      nameSchema,
      v.check((name) => {
        return get(store.$ids).every((itemId) => {
          if (itemId === id) {
            return true;
          }

          return name.toLowerCase() !== get(store.getItem(itemId).name.$raw).toLowerCase();
        });
      }, "Name must be unique"),
    ),
  );
}

export type LevelStore = {
  id: LevelId;
  name: ValidationStore<string, LevelName>;
  contrast: ValidationStore<string | number, LevelContrast>;
  chroma: ValidationStore<string | number, LevelChroma>;
  chromaCap: ValidationStore<string | number | null, LevelChroma | null>;
  $tintColor: WritableSignal<ColorLevelTintData>;
};

const $levelConstrastSchema = signal((get) =>
  getLevelContrastModel(get(contrastModelStore.$lastValidValue)),
);

export function getLevelStore(data: PartialOptional<LevelData, "tintColor">) {
  const levelId = LevelId(id());
  const $levelNameUniqueSchema = getNameValidationSchemaSignal(
    levelId,
    levelNameSchema,
    levelsStore,
  );
  const name = validationStore(data.name, $levelNameUniqueSchema);
  const contrast = validationStore(data.contrast, $levelConstrastSchema);
  const chroma = validationStore(data.chroma, levelChromaSchema);
  const chromaCap = validationStore(data.chromaCap ?? null, levelChromaCapSchema);
  const $tintColor = signal(data.tintColor ?? FALLBACK_LEVEL_TINT_COLOR);

  return {
    id: levelId,
    name,
    contrast,
    chroma,
    chromaCap,
    $tintColor,
  };
}

export type HueStore = {
  id: HueId;
  name: ValidationStore<string, HueName>;
  angle: ValidationStore<string | number, HueAngle>;
  $tintColor: WritableSignal<ColorHueTintData>;
  $closestColorName: Signal<HueName>;
};
export function getHueStore(data: PartialOptional<HueData, "tintColor">) {
  const hueId = HueId(id());
  const $hueNameUniqueSchema = getNameValidationSchemaSignal(hueId, hueNameSchema, huesStore);
  const name = validationStore(data.name, $hueNameUniqueSchema);
  const angle = validationStore(data.angle, hueAngleSchema);
  const $tintColor = getColorSignal(data.tintColor ?? FALLBACK_HUE_TINT_COLOR);
  const $closestColorName = signal((get) =>
    HueName(getClosestColorName(get(angle.$lastValidValue))),
  );

  return {
    id: hueId,
    name,
    angle,
    $tintColor,
    $closestColorName,
  };
}
