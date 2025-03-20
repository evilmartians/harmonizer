import { filterBoolean } from "@core/utils/array/filterBoolean";

type AnyCallback = (...params: unknown[]) => void;

export const chainCallbacks = (...callbacks: (undefined | false | AnyCallback)[]): AnyCallback => {
  const realCallbacks = filterBoolean(callbacks);

  if (realCallbacks.length === 1) {
    return realCallbacks[0] as AnyCallback;
  }

  return (...params: unknown[]) => {
    for (const callback of realCallbacks) callback(...params);
  };
};
