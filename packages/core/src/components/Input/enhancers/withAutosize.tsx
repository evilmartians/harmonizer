import { type ComponentType, useLayoutEffect, useMemo, useRef } from "react";

import clsx from "clsx";

import { mergeRefs } from "@core/utils/react/mergeRefs";

import type { InputProps } from "../Input";

import styles from "./enhancers.module.css";

export function withAutosize<P extends InputProps>(WrappedComponent: ComponentType<P>) {
  const AutosizeInput = (props: P) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { value, placeholder } = props;
    const refCallback = useMemo(() => mergeRefs(inputRef, props.ref), []);

    useLayoutEffect(() => {
      if (!inputRef.current) return;

      // oxlint-disable-next-line typescript/prefer-nullish-coalescing
      inputRef.current.style.width = `${String(value || placeholder || " ").length}ch`;
    }, [value, placeholder]);

    return (
      <WrappedComponent
        {...props}
        ref={refCallback}
        className={clsx(props.className, styles.autosize)}
      />
    );
  };

  AutosizeInput.displayName = `withAutosize(${WrappedComponent.displayName ?? WrappedComponent.name})`;
  return AutosizeInput;
}
