import { type ComponentType, useEffect, useMemo, useRef } from "react";

import { mergeRefs } from "@core/utils/react/mergeRefs";

import type { InputProps } from "../Input";

type ValidationProps = {
  error: string | null;
};

export function withValidation<P extends InputProps>(WrappedComponent: ComponentType<P>) {
  const ValidationInput = ({ error, ...restProps }: P & ValidationProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const refCallback = useMemo(() => mergeRefs(inputRef, restProps.ref), []);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.setCustomValidity(error ?? "");
      }
    }, [error]);

    return (
      <WrappedComponent
        {...(restProps as unknown as P)}
        title={error ?? restProps.title ?? ""}
        aria-invalid={!!error}
        aria-errormessage={error}
        ref={refCallback}
      />
    );
  };

  return ValidationInput as ComponentType<P & ValidationProps>;
}
