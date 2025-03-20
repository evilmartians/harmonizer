import type { Signal } from "@spred/core";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type InitialSignalValue<V> = Exclude<V, Function>;
export type SignalOrValue<V> = Signal<V> | V;
