import {
  type ChangeEvent,
  type ComponentType,
  type FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import clsx from "clsx";

import { isNumber } from "@core/utils/number/isNumber";
import { mergeRefs } from "@core/utils/react/mergeRefs";

import type { InputProps } from "../Input";

import styles from "./enhancers.module.css";

type WithNumericIncrementControlsProps = {
  /**
   * The base value for arrows & wheel value manipulations. Will be used only when value isn't defined.
   */
  baseValue?: number | string;
  /**
   * How many decimal places to display.
   */
  precision?: number;
  /**
   * The step value for incrementing/decrementing the input value.
   */
  step?: number;
  /**
   * Whether to loop the value when reaching the min/max bounds.
   */
  loopControls?: boolean;
};

function formatWithPrecision(value: string | number, precision: number): string {
  const number = Number(value);
  return (Number.isNaN(number) ? 0 : number).toFixed(precision);
}

function isNumericInputMode(inputMode: string) {
  return inputMode === "numeric" || inputMode === "decimal";
}

function replaceDecimalDelimiter(value: string): string {
  return value.replace(",", ".");
}

function createChangeEvent(input: HTMLInputElement) {
  const nativeEvent = new Event("change", { bubbles: true });
  Object.defineProperty(nativeEvent, "target", { value: input });
  Object.defineProperty(nativeEvent, "currentTarget", { writable: false, value: input });

  return nativeEvent as unknown as ChangeEvent<HTMLInputElement>;
}

function calculateNewInputValue(
  input: HTMLInputElement,
  options: {
    step: number;
    baseValue?: number | string;
    precision?: number;
    loopControls?: boolean;
  },
  modifiers:
    | { multiplier: number; direction: -1 | 1; min?: number; max?: number }
    | { value: number },
) {
  if ("value" in modifiers) {
    return modifiers.value;
  }

  const currentValue = Number.parseFloat(
    input.value || (options.baseValue ? String(options.baseValue) : ""),
  );

  if (Number.isNaN(currentValue)) {
    return;
  }

  const updatedValue = currentValue + options.step * modifiers.multiplier * modifiers.direction;

  if (isNumber(modifiers.min) && isNumber(modifiers.max) && options.loopControls) {
    if (updatedValue < modifiers.min) {
      return modifiers.max;
    }
    if (updatedValue > modifiers.max) {
      return modifiers.min;
    }
  }

  if (isNumber(modifiers.min) && updatedValue < modifiers.min) {
    return Math.max(updatedValue, modifiers.min);
  }

  if (isNumber(modifiers.max) && updatedValue > modifiers.max) {
    return Math.min(updatedValue, modifiers.max);
  }

  return updatedValue;
}

export function withNumericIncrementControls<P extends InputProps>(
  WrappedComponent: ComponentType<P>,
) {
  const NumberKeyboardInput = ({
    step = 1,
    value,
    baseValue,
    precision = -Math.log10(step),
    loopControls,
    ...props
  }: WithNumericIncrementControlsProps & P) => {
    const { onChange, onBlur } = props;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    const refCallback = useMemo(() => mergeRefs(inputRef, props.ref), []);
    const labelRefCallback = useMemo(() => mergeRefs(labelRef, props.labelRef), []);

    const updateValue = useCallback(
      (
        input: HTMLInputElement,
        options:
          | { multiplier: number; direction: -1 | 1; min?: number; max?: number }
          | { value: number },
      ) => {
        const newValue = calculateNewInputValue(
          input,
          {
            step,
            baseValue,
            precision,
            loopControls,
          },
          options,
        );

        if (newValue === undefined) {
          return;
        }

        input.value = formatWithPrecision(newValue, precision);
        onChange?.(createChangeEvent(input));
      },
      [onChange, precision, loopControls, baseValue, step],
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
            min: isNumber(props.min) ? props.min : undefined,
            max: isNumber(props.max) ? props.max : undefined,
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
          min: isNumber(props.min) ? props.min : undefined,
          max: isNumber(props.max) ? props.max : undefined,
        });
      };

      label.addEventListener("wheel", handleWheel);

      return () => label.removeEventListener("wheel", handleWheel);
    }, [step, updateValue]);

    const handleOnChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const input = inputRef.current;

        if (!input) return;

        if (props.inputMode && isNumericInputMode(props.inputMode)) {
          e.target.value = replaceDecimalDelimiter(e.target.value);
        }

        onChange?.(e);
      },
      [onChange],
    );

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        const input = inputRef.current;

        if (!input?.value) return;

        const formattedValue = formatWithPrecision(input.value, precision);
        if (input.value !== formattedValue) {
          input.value = formattedValue;
          onChange?.(createChangeEvent(input));
        }

        onBlur?.(e);
      },
      [onBlur, onChange],
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
        className={clsx(props.className, styles.numericIncrement)}
      />
    );
  };

  return NumberKeyboardInput as ComponentType<P & WithNumericIncrementControlsProps>;
}
