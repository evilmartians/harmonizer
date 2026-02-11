import type { Signal } from "@spred/core";

// oxlint-disable-next-line typescript/no-unsafe-function-type
export type InitialSignalValue<V> = Exclude<V, Function>;
export type SignalOrValue<V> = Signal<V> | V;
