import { type Signal, signal } from "@spred/core";

import { isSignal } from "./isSignal";
import type { InitialSignalValue } from "./types";

export function toSignal<V>(value: InitialSignalValue<Signal<V> | V>): Signal<V> {
  return isSignal(value) ? value : signal(value);
}
