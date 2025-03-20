import type { ReactElement, ReactNode } from "react";
import { cloneElement, isValidElement } from "react";

import { mergeProps } from "./mergeProps";
import type { AnyProps } from "./types";

export type ExtendableProp<P extends AnyProps> =
  | ReactElement<P>
  | string
  | number
  | null
  | undefined;

export function extendableProp<P extends AnyProps>(
  propValue: ExtendableProp<P>,
  props?: Partial<P>,
): ReactNode {
  if (isValidElement(propValue)) {
    return cloneElement(propValue, mergeProps(propValue.props, props) as P);
  }

  return propValue;
}
