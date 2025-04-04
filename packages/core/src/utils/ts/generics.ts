export type PartialOptional<
  Base extends Record<string, unknown>,
  Optional extends keyof Base,
> = Base extends unknown ? Partial<Pick<Base, Optional>> & Omit<Base, Optional> : never;

export type PartialRequired<
  Base extends Record<string, unknown>,
  RequiredKeys extends keyof Base,
  ExcludeNull = false,
> = Base extends unknown
  ? {
      [Key in RequiredKeys]-?: ExcludeNull extends true ? Exclude<Base[Key], null> : Base[Key];
    } & Omit<Base, RequiredKeys>
  : never;

export type NoDeepReadonly<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>
    ? { -readonly [K in keyof T]: NoDeepReadonly<T[K]> }
    : T extends readonly (infer U)[]
      ? U[]
      : T extends Readonly<infer U>
        ? U
        : T;
