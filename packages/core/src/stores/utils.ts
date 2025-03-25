import {
  HueName,
  LevelName,
  type ColorCellData,
  type ColorIdentifier,
  type Hue,
  type HueData,
  type HueId,
  type Level,
  type LevelData,
  type LevelId,
} from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";
import { getClosestColorName } from "@core/utils/colors/getClosestColorName";
import { getMiddleContrastLevel } from "@core/utils/colors/getMiddleContrastLevel";
import { getMiddleHueAngle } from "@core/utils/colors/getMiddleHueAngle";
import { getMiddleNumber } from "@core/utils/number/getMiddleNumber";
import { id } from "@core/utils/random/id";
import type { PartialOptional } from "@core/utils/ts/generics";
import { Signal, signal, type SignalOptions, type WritableSignal } from "@spred/core";
import { shallowEqual } from "fast-equals";

import { FALLBACK_HUE_TINT_COLOR, FALLBACK_LEVEL_TINT_COLOR } from "./constants";

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
  return { ...data, id: id() } as Item;
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
    ? String(getMiddleNumber(prevName, nextName))
    : lowerName;
}

export function getMiddleLevel(
  lowerLevelStore: LevelStore,
  upperLevelStore: LevelStore,
): LevelStore {
  return cloneStore(lowerLevelStore, {
    $name: signal(
      LevelName(getMiddleLevelName(lowerLevelStore.$name.value, upperLevelStore.$name.value)),
    ),
    $contrast: signal(
      getMiddleContrastLevel(lowerLevelStore.$contrast.value, upperLevelStore.$contrast.value),
    ),
  });
}

export function getMiddleHue(hueStore1: HueStore, hueStore2: HueStore): HueStore {
  const middleHueAngle = getMiddleHueAngle(hueStore1.$angle.value, hueStore2.$angle.value);

  return cloneStore(hueStore1, {
    $name: signal(HueName(getClosestColorName(middleHueAngle))),
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
  onFinish: (id: MainItem["id"]) => void;
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
  return (beforeId?: MainItem["id"]) => {
    const nextIndex = beforeId ? main.$ids.value.indexOf(beforeId) : main.$ids.value.length;
    const previousId = main.$ids.value[nextIndex - 1];
    const nextId = main.$ids.value[nextIndex];

    let newItem = getNewItem();

    if (previousId && nextId) {
      newItem = getMiddleItem(main.getItem(previousId), main.getItem(nextId));
    } else if (previousId) {
      newItem = cloneStore(main.getItem(previousId));
    }

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
