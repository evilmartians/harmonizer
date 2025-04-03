import { mergeRefs } from "@core/utils/react/mergeRefs";
import { type ComponentType, useEffect, useRef } from "react";

import type { InputProps } from "../Input";

type ValidationProps = {
  error: string | null;
};

export function withValidation<P extends InputProps>(WrappedComponent: ComponentType<P>) {
  const ValidationInput = ({ error, ...restProps }: P & ValidationProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.setCustomValidity(error ?? "");
      }
    }, [error]);

    return (
      <WrappedComponent
        {...(restProps as unknown as P)}
        title={error ?? restProps.title ?? ""}
        ref={mergeRefs(inputRef, restProps.ref)}
      />
    );
  };

  return ValidationInput as React.ComponentType<P & ValidationProps>;
}
