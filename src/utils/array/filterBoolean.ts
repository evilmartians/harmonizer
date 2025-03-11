export const filterBoolean = <T>(arr: T[]) =>
  arr.filter(Boolean) as Exclude<T, false | null | undefined | 0 | "">[];
