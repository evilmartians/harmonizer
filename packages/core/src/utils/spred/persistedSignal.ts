import { signal, type WritableSignal } from "@spred/core";

type PersistedSignal<T> = WritableSignal<T> & {
  delete: VoidFunction;
};

export function persistedSignal<T>(
  key: string,
  // oxlint-disable-next-line typescript/no-unsafe-function-type
  initial: Exclude<T, Function>,
  storage: Storage = globalThis.localStorage,
): PersistedSignal<T> {
  function getInitialValue() {
    const storageValue = storage.getItem(key);

    if (storageValue === null) {
      return initial;
    }

    // oxlint-disable-next-line typescript/no-unsafe-function-type
    return JSON.parse(storageValue) as Exclude<T, Function>;
  }

  const $signal = signal<T>(getInitialValue(), { onActivate }) as PersistedSignal<T>;
  const originalSetter = $signal.set.bind($signal);

  $signal.set = function (newValue: T) {
    storage.setItem(key, JSON.stringify(newValue));
    originalSetter(newValue);
  };

  $signal.delete = function () {
    storage.removeItem(key);
    originalSetter(initial);
  };

  function onStorageChange(event: StorageEvent) {
    if (event.key !== key) {
      return;
    }

    if (event.newValue === null) {
      $signal.delete();
      return;
    }

    const newValue =
      // oxlint-disable-next-line typescript/no-unsafe-function-type
      JSON.parse(event.newValue) as Exclude<T, Function>;
    $signal.set(newValue);
  }

  function onActivate() {
    globalThis.addEventListener("storage", onStorageChange);

    return () => {
      globalThis.removeEventListener("storage", onStorageChange);
    };
  }

  return $signal;
}
