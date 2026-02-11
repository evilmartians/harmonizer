import type { Signal } from "@spred/core";

import type { ValidationStore } from "./validationStore";

export const SIGNAL_KEY_PREFIX = "$";

export type SignalKey<Key extends string> = `${typeof SIGNAL_KEY_PREFIX}${Key}`;

// oxlint-disable-next-line typescript/no-explicit-any
export type AnyStore = Record<string, any>;

export type StoreReactivePaths<T extends AnyStore> = {
  [Key in keyof T]: T[Key] extends Signal<unknown>
    ? Key extends SignalKey<infer SK>
      ? SK
      : never
    : T[Key] extends ValidationStore
      ? Key
      : never;
}[keyof T] &
  string;

export type StoreReactiveValue<T extends AnyStore, Key extends keyof T> =
  T[Key] extends Signal<infer Value>
    ? Value
    : T[Key] extends ValidationStore<unknown, infer Value>
      ? Value
      : never;

export type StoreReactiveValues<T extends AnyStore> = {
  [Key in StoreReactivePaths<T>]: T[SignalKey<Key>] extends Signal<infer Value>
    ? Value
    : StoreReactiveValue<T, Key>;
};
