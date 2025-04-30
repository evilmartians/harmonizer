import type { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType } from "react";

export type PolymorphicComponentProps<E extends ElementType> = ComponentPropsWithoutRef<E> & {
  as?: E;
};

export type PolymorphicRef<E extends ElementType> = ComponentPropsWithRef<E>["ref"];

export type PolymorphicComponentPropsWithRef<E extends ElementType> =
  PolymorphicComponentProps<E> & { ref?: PolymorphicRef<E> };
