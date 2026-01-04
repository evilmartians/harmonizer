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

type Primitive = string | number | boolean | bigint | symbol | undefined | null;

export type NoDeepReadonly<T> = T extends Primitive
  ? T
  : T extends readonly (infer U)[]
    ? NoDeepReadonly<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: NoDeepReadonly<T[K]> }
      : T;
