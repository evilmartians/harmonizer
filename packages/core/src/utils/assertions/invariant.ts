type Newable<T> = new (...args: any[]) => T;

export function invariant(
  condition: unknown,
  message: string,
  ErrorClass: Newable<Error> = Error,
): asserts condition {
  if (!condition) {
    throw new ErrorClass(message);
  }
}
