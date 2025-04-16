import type { Signal } from "@spred/core";

import { isNumber } from "@core/utils/number/isNumber";
import { parseNumber } from "@core/utils/number/parseNumber";
import { objectEntries } from "@core/utils/object/objectEntries";
import { isSignal } from "@core/utils/spred/isSignal";

import { getStoreReactiveValue } from "./getStoreReactiveValue";
import type { AnyStore, StoreReactivePaths } from "./types";

type StoreProducerRuleValue<V extends number> = V | Signal<V> | (() => V);

type StoreProducerRule = {
  min?: StoreProducerRuleValue<number>;
  max?: StoreProducerRuleValue<number>;
  step?: StoreProducerRuleValue<number>;
  forceStep?: boolean;
};

export type StoreProducerRules<Store extends AnyStore> = Partial<
  Record<StoreReactivePaths<Store>, StoreProducerRule>
>;
type InferStoreFromRules<Rules> = Rules extends StoreProducerRules<infer Store> ? Store : never;

type ProducerResult<Rules> = { [Key in keyof Rules]: number };

export function getInsertionDataProducer<Rules extends StoreProducerRules<AnyStore>>(rules: Rules) {
  return function insertionDataProducer(
    insertAt: number,
    stores: InferStoreFromRules<Rules>[],
  ): Partial<ProducerResult<Rules>> {
    const prevStore = stores[insertAt - 1];
    const nextStore = stores[insertAt];
    const prevPrevStore = stores[insertAt - 2];
    const nextNextStore = stores[insertAt + 1];
    let newStoreData = {} as Partial<ProducerResult<Rules>>;

    if (insertAt === 0 && nextStore) {
      newStoreData = produceStoreDataAtEnds(rules, "start", nextStore, nextNextStore);
    } else if (insertAt === stores.length && prevStore) {
      newStoreData = produceStoreDataAtEnds(rules, "end", prevStore, prevPrevStore);
    } else if (prevStore && nextStore) {
      newStoreData = produceStoreDataAtMiddle(rules, prevStore, nextStore);
    }

    return newStoreData;
  };
}

export function getRuleValue<V extends number>(value?: StoreProducerRuleValue<V>) {
  if (typeof value === "function") {
    return value();
  }

  if (isSignal(value)) {
    return value.value;
  }

  return value;
}

function clampStoreValue(min: number | undefined, value: number, max: number | undefined) {
  value = Math.round(value);

  if (isNumber(min) && value < min) {
    value = min;
  }

  if (isNumber(max) && value > max) {
    value = max;
  }

  return value;
}

function produceStoreDataAtEnds<Store extends AnyStore, Rules extends StoreProducerRules<Store>>(
  rules: Rules,
  position: "start" | "end",
  closestStore: Store,
  nextToClosestStore?: Store,
): Partial<ProducerResult<Rules>> {
  const result = {} as Partial<ProducerResult<Rules>>;

  for (const [key, rule] of objectEntries(rules)) {
    if (!rule) continue;

    const closestStoreValue = getStoreReactiveValue(closestStore, key as StoreReactivePaths<Store>);
    const closestStoreNumberValue = parseNumber(closestStoreValue, Number.parseFloat);
    const nextToClosestStoreNumberValue =
      nextToClosestStore &&
      parseNumber(
        getStoreReactiveValue(nextToClosestStore, key as StoreReactivePaths<Store>),
        Number.parseFloat,
      );
    const step = getRuleValue(rule.step);
    let newKeyValue: number | undefined;

    if (!isNumber(closestStoreNumberValue)) {
      continue;
    }

    if (
      isNumber(step) &&
      (!nextToClosestStoreNumberValue || (nextToClosestStoreNumberValue && rule.forceStep))
    ) {
      newKeyValue = clampStoreValue(
        getRuleValue(rule.min),
        closestStoreNumberValue + step * (position === "start" ? -1 : 1),
        getRuleValue(rule.max),
      );
    } else if (nextToClosestStoreNumberValue) {
      newKeyValue = clampStoreValue(
        getRuleValue(rule.min),
        closestStoreNumberValue + (closestStoreNumberValue - nextToClosestStoreNumberValue),
        getRuleValue(rule.max),
      );
    }

    result[key] = newKeyValue ?? closestStoreNumberValue;
  }

  return result;
}

function produceStoreDataAtMiddle<Store extends AnyStore, Rules extends StoreProducerRules<Store>>(
  rules: Rules,
  prevStore: Store,
  nextStore: Store,
): Partial<ProducerResult<Rules>> {
  const result = {} as Partial<ProducerResult<Rules>>;

  for (const [key, rule] of objectEntries(rules)) {
    if (!rule) continue;

    const prevStoreValue = getStoreReactiveValue(prevStore, key as StoreReactivePaths<Store>);
    const prevStoreNumberValue = parseNumber(prevStoreValue);
    const nextStoreNumberValue = parseNumber(
      getStoreReactiveValue(nextStore, key as StoreReactivePaths<Store>),
    );

    if (isNumber(prevStoreNumberValue) && isNumber(nextStoreNumberValue)) {
      result[key] = clampStoreValue(
        getRuleValue(rule.min),
        (prevStoreNumberValue + nextStoreNumberValue) / 2,
        getRuleValue(rule.max),
      );
    }
  }

  return result;
}
