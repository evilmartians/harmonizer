import {
  type ChangeEvent,
  type ComponentType,
  type FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { isNumber } from "@core/utils/number/isNumber";
import { mergeRefs } from "@core/utils/react/mergeRefs";

import type { InputProps } from "../Input";

type WithNumericIncrementControlsProps = {
  step?: number;
};

function formatWithFractional(value: string | number, fractionalLength: number): string {
  const number = Number(value);
  return (Number.isNaN(number) ? 0 : number).toFixed(fractionalLength);
}

const NUMERIC_REGEX = /^\d*$/;
const DECIMAL_REGEX = /^\d*(?:[.,])?\d*$/;

function replaceDecimalDelimiter(value: string): string {
  return value.replace(",", ".");
}

function isInputValid(inputMode: string | undefined, value: string) {
  switch (inputMode) {
    case "numeric": {
      return NUMERIC_REGEX.test(value);
    }
    case "decimal": {
      return DECIMAL_REGEX.test(value);
    }
    default: {
      return true;
    }
  }
}

export function withNumericIncrementControls<P extends InputProps>(
  WrappedComponent: ComponentType<P>,
) {
  const NumberKeyboardInput = ({
    step = 1,
    value,
    ...props
  }: WithNumericIncrementControlsProps & P) => {
    const { onChange, onBlur } = props;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    const fractionalLength = -Math.log10(step);
    const refCallback = useMemo(() => mergeRefs(inputRef, props.ref), []);
    const labelRefCallback = useMemo(() => mergeRefs(labelRef, props.labelRef), []);

    const updateValue = useCallback(
      (
        input: HTMLInputElement,
        {
          multiplier,
          direction,
          value,
        }:
          | { multiplier: number; direction: -1 | 1; value?: undefined }
          | { value: number; multiplier?: undefined; direction?: undefined },
      ) => {
        const newValue = (() => {
          if (value !== undefined) {
            return value;
          }

          const currentValue = Number.parseFloat(input.value);

          if (Number.isNaN(currentValue)) {
            return;
          }

          return Number(currentValue + step * multiplier * direction);
        })();

        if (newValue === undefined) {
          return;
        }

        input.value = formatWithFractional(newValue, fractionalLength);

        if (onChange) {
          const nativeEvent = new Event("change", { bubbles: true });
          Object.defineProperty(nativeEvent, "target", { value: input });

          onChange({
            ...nativeEvent,
            target: input,
            currentTarget: input,
          } as unknown as ChangeEvent<HTMLInputElement>);
        }
      },
      [onChange, fractionalLength],
    );

    useEffect(() => {
      const input = inputRef.current;

      if (!input) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        const isPageUpOrDown = e.key === "PageUp" || e.key === "PageDown";
        const isArrowUpOrDown = e.key === "ArrowUp" || e.key === "ArrowDown";

        if (isPageUpOrDown || isArrowUpOrDown) {
          e.preventDefault();
          updateValue(input, {
            multiplier: e.shiftKey || isPageUpOrDown ? 10 : 1,
            direction: e.key === "ArrowUp" || e.key === "PageUp" ? 1 : -1,
          });
        } else if (e.key === "Home" && isNumber(props.min)) {
          e.preventDefault();
          updateValue(input, { value: props.min });
        } else if (e.key === "End" && isNumber(props.max)) {
          e.preventDefault();
          updateValue(input, { value: props.max });
        }
      };

      input.addEventListener("keydown", handleKeyDown);

      return () => input.removeEventListener("keydown", handleKeyDown);
    }, [step, updateValue, props.min, props.max]);

    useEffect(() => {
      const label = labelRef.current;
      const input = inputRef.current;

      if (!label || !input) return;

      const handleWheel = (e: WheelEvent) => {
        if (document.activeElement !== input || !label.matches(":hover")) return;

        e.preventDefault();
        updateValue(input, {
          multiplier: e.shiftKey ? 10 : 1,
          direction: e[e.shiftKey ? "deltaX" : "deltaY"] < 0 ? 1 : -1,
        });
      };

      label.addEventListener("wheel", handleWheel);

      return () => label.removeEventListener("wheel", handleWheel);
    }, [step, updateValue]);

    const handleOnChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const input = inputRef.current;

        if (!input) return;

        if (isInputValid(input.inputMode, input.value)) {
          e.target.value = replaceDecimalDelimiter(e.target.value);
          onChange?.(e);
        }
      },
      [onChange],
    );

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        const input = inputRef.current;

        if (!input?.value) return;

        const formattedValue = formatWithFractional(input.value, fractionalLength);
        if (input.value !== formattedValue) {
          input.value = formattedValue;
        }

        onBlur?.(e);
      },
      [onBlur],
    );

    return (
      <WrappedComponent
        {...(props as P)}
        role="spinbutton"
        step={step}
        aria-valuenow={value}
        aria-valuemin={props.min}
        aria-valuemax={props.max}
        value={value}
        onChange={handleOnChange}
        onBlur={handleBlur}
        ref={refCallback}
        labelRef={labelRefCallback}
      />
    );
  };

  return NumberKeyboardInput as ComponentType<P & WithNumericIncrementControlsProps>;
}
