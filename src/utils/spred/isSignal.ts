import { Signal } from "@spred/core";

export function isSignal(value: unknown): value is Signal<unknown> {
  return value instanceof Signal;
}
