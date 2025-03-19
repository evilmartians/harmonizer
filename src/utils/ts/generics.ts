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
