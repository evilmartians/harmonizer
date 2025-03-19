import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType } from "react";

export type PolymorphicComponentProps<
  E extends ElementType,
  Props = object,
> = ComponentPropsWithoutRef<E> & Props & { as?: E };

export type PolymorphicRef<E extends ElementType> = ComponentPropsWithRef<E>["ref"];

export type PolymorphicComponentPropsWithRef<
  E extends ElementType,
  Props = object,
> = PolymorphicComponentProps<E, Props> & { ref?: PolymorphicRef<E> };
