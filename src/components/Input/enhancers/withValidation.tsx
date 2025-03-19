import {
  type ChangeEvent,
  type ComponentType,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { type BaseIssue, type BaseSchema, safeParse } from "valibot";

import type { InputProps } from "../Input";

import { mergeRefs } from "@/utils/react/mergeRefs";

type ValidationProps = {
  schema: BaseSchema<string, string, BaseIssue<unknown>>;
};

export function withValidation<P extends InputProps>(WrappedComponent: ComponentType<P>) {
  const ValidationInput = ({ schema, value: outboundValue, ...props }: P & ValidationProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [value, setValue] = useState(outboundValue);
    const [errorMessage, setErrorMessageErrorMessage] = useState<string | null>(null);
    const { onChange } = props;
    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);

        const result = safeParse(schema, event.target.value);

        setErrorMessageErrorMessage(
          result.success ? null : result.issues.map((i) => i.message).join("; "),
        );

        if (result.success) {
          onChange?.(event);
        }
      },
      [schema, onChange],
    );

    useEffect(() => setValue(outboundValue), [outboundValue]);
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.setCustomValidity(errorMessage ?? "");
      }
    }, [errorMessage]);

    return (
      <WrappedComponent
        {...(props as unknown as P)}
        value={value}
        title={errorMessage ?? props.title}
        onChange={handleChange}
        ref={mergeRefs(inputRef, props.ref)}
      />
    );
  };

  return ValidationInput as React.ComponentType<P & ValidationProps>;
}
