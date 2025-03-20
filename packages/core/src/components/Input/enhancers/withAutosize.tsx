import { mergeRefs } from "@core/utils/react/mergeRefs";
import clsx from "clsx";
import { type ComponentType, useLayoutEffect, useRef } from "react";

import type { InputProps } from "../Input";

import styles from "./enhancers.module.css";

export function withAutosize<P extends InputProps>(WrappedComponent: ComponentType<P>) {
  const AutosizeInput = (props: P) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { value, placeholder } = props;

    useLayoutEffect(() => {
      if (!inputRef.current) return;

      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      inputRef.current.style.width = `${String(value || placeholder || " ").length}ch`;
    }, [value, placeholder]);

    return (
      <WrappedComponent
        {...props}
        ref={mergeRefs(inputRef, props.ref)}
        className={clsx(props.className, styles.autosize)}
      />
    );
  };

  AutosizeInput.displayName = `withAutosize(${WrappedComponent.displayName ?? WrappedComponent.name})`;
  return AutosizeInput;
}
