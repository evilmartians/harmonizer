// It is handy to use such helper for exhaustive check

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertUnreachable(_x: never): never {
  throw new Error("Must be unreachable.");
}
