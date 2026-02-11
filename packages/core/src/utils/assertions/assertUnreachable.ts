// It is handy to use such helper for exhaustive check

// oxlint-disable-next-line typescript/no-unused-vars
export function assertUnreachable(_x: never): never {
  throw new Error("Must be unreachable.");
}
