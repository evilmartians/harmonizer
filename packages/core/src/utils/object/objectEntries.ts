// Based on https://github.com/microsoft/TypeScript/issues/35101
export type ObjectEntries<Obj> = {
  [Key in keyof Obj]: [Key, Obj[Key]];
}[keyof Obj][];

/**
 * It's like Object.entries, but it keeps the type of the object.
 */
export function objectEntries<Obj extends Record<string, unknown>>(object: Obj) {
  return Object.entries(object) as ObjectEntries<Obj>;
}
