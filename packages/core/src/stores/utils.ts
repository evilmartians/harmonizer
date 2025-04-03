import {
  getLevelContrastModel,
  hueAngleSchema,
  hueNameSchema,
  levelChromaSchema,
  levelNameSchema,
} from "@core/schemas/color";
import {
  HueId,
  LevelId,
  LevelName,
  type ColorCellData,
  type ColorHueTintData,
  type ColorIdentifier,
  type ColorLevelTintData,
  type HueAngle,
  type HueData,
  type HueName,
  type LevelChroma,
  type LevelContrast,
  type LevelData,
} from "@core/types";
import { invariant } from "@core/utils/assertions/invariant";
import { getMiddleNumber } from "@core/utils/number/getMiddleNumber";
import { id } from "@core/utils/random/id";
import { isSignal } from "@core/utils/spred/isSignal";
import type { PartialOptional } from "@core/utils/ts/generics";
import { effect, signal, type Signal, type SignalOptions, type WritableSignal } from "@spred/core";
import { shallowEqual } from "fast-equals";
import type { BaseIssue, BaseSchema } from "valibot";
import * as v from "valibot";

import { huesStore, levelsStore } from "./colors";
import { FALLBACK_HUE_TINT_COLOR, FALLBACK_LEVEL_TINT_COLOR } from "./constants";
import { contrastModelStore } from "./settings";

export type AnyId = string;
export type ItemWithId<Id extends string> = { id: Id; [key: string]: unknown };

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

export function getMiddleLevelName(lowerName: LevelName, upperName: LevelName): LevelName {
  const prevName = Number.parseInt(lowerName, 10);
  const nextName = Number.parseInt(upperName, 10);

  return !Number.isNaN(prevName) && !Number.isNaN(nextName)
    ? LevelName(String(getMiddleNumber(prevName, nextName)))
    : lowerName;
}

type GetInsertMethodOptions<
  MainItem extends ItemWithId<AnyId>,
  CrossItem extends ItemWithId<AnyId>,
> = {
  main: IndexedStore<MainItem>;
  cross: IndexedStore<CrossItem>;
  getNewItem: (previous?: MainItem, next?: MainItem) => MainItem;
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
    const nextId = main.$ids.value[nextIndex];
    const newItem = getNewItem(
      previousId && main.getItem(previousId),
      nextId && main.getItem(nextId),
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

type ValidationStore<Output> = {
  $raw: WritableSignal<Output>;
  $lastValidValue: Signal<Output>;
  $validationError: Signal<string | null>;
};

export function validationStore<Input, Output>(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  initialValue: Exclude<Output, Function>,
  validationSchema:
    | BaseSchema<Input, Output, BaseIssue<unknown>>
    | Signal<BaseSchema<Input, Output, BaseIssue<unknown>>>,
): ValidationStore<Output> {
  const $raw = signal(initialValue);
  const $lastValidValue = signal(initialValue);
  const $validationSchema = isSignal(validationSchema)
    ? validationSchema
    : signal(validationSchema);
  const $validationError = signal<string | null>(null);

  effect((get) => {
    const validationResult = v.safeParse(get($validationSchema), get($raw), {
      abortEarly: true,
      abortPipeEarly: true,
    });

    if (validationResult.success) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      $lastValidValue.set(validationResult.output as Exclude<Output, Function>);
    }

    $validationError.set(validationResult.success ? null : validationResult.issues[0].message);
  });

  return {
    $raw,
    $lastValidValue,
    $validationError,
  };
}

export function getNameValidationSchemaSignal<
  Id extends AnyId,
  Name extends string,
  Item extends { id: Id; name: ValidationStore<Name> },
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
  name: ValidationStore<LevelName>;
  contrast: ValidationStore<LevelContrast>;
  chroma: ValidationStore<LevelChroma>;
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
  const $tintColor = signal(data.tintColor ?? FALLBACK_LEVEL_TINT_COLOR);

  return {
    id: levelId,
    name,
    contrast,
    chroma,
    $tintColor,
  };
}

export type HueStore = {
  id: HueId;
  name: ValidationStore<HueName>;
  angle: ValidationStore<HueAngle>;
  $tintColor: WritableSignal<ColorHueTintData>;
};
export function getHueStore(data: PartialOptional<HueData, "tintColor">) {
  const hueId = HueId(id());
  const $hueNameUniqueSchema = getNameValidationSchemaSignal(hueId, hueNameSchema, huesStore);
  const name = validationStore(data.name, $hueNameUniqueSchema);
  const angle = validationStore(data.angle, hueAngleSchema);
  const $tintColor = getColorSignal(data.tintColor ?? FALLBACK_HUE_TINT_COLOR);

  return {
    id: hueId,
    name,
    angle,
    $tintColor,
  };
}
