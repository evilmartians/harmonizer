import type { ElementType } from "react";

import type { PolymorphicComponentPropsWithRef } from "@core/utils/react/polymorphic";

import type { BgModeType } from "./types";

export type BgModeProps<E extends ElementType> = PolymorphicComponentPropsWithRef<E> & {
  className?: string;
  bgMode: BgModeType;
};

export function BgMode<E extends ElementType>({ as, bgMode, ...restProps }: BgModeProps<E>) {
  const Component: ElementType = as ?? "div";

  return <Component {...restProps} data-bg-mode={bgMode} />;
}
