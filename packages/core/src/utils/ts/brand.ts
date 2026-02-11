declare const __brand: unique symbol;

export type Branded<T, BrandId> = T & { [__brand]: BrandId };

export function createBrand<BaseType, BrandId extends string>(
  value: BaseType,
): Branded<BaseType, BrandId> {
  return value as Branded<BaseType, BrandId>;
}

export type Brand<CreatorType> = CreatorType extends (
  // oxlint-disable-next-line typescript/no-explicit-any
  value: any,
) => Branded<infer U, infer BrandId extends string>
  ? Branded<U, BrandId>
  : never;

// oxlint-disable-next-line typescript/no-explicit-any
export type Unbranded<T> = T extends Branded<infer U, any> ? U : never;
