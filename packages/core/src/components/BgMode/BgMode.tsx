import type { PolymorphicComponentPropsWithRef } from "@core/utils/react/polymorphic";
import type { ElementType } from "react";

import type { BgModeType } from "./types";

export type BgModeProps<E extends ElementType> = PolymorphicComponentPropsWithRef<E> & {
  className?: string;
  bgMode: BgModeType;
};

export function BgMode<E extends ElementType>({ as, bgMode, ...restProps }: BgModeProps<E>) {
  const Component = as ?? ("div" as ElementType);

  return <Component {...restProps} data-bg-mode={bgMode} />;
}
