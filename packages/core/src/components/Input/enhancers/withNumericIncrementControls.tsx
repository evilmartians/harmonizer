import { isNumber } from "@core/utils/number/isNumber";
import { mergeRefs } from "@core/utils/react/mergeRefs";
import { type ChangeEvent, type ComponentType, useCallback, useEffect, useRef } from "react";

import type { InputProps } from "../Input";

type WithNumericIncrementControlsProps = {
  step?: number;
};

function formatWithFractional(value: string, fractionalLength: number): string {
  const number = Number(value);
  return Number.isNaN(number) || fractionalLength === 0 ? value : number.toFixed(fractionalLength);
}

export function withNumericIncrementControls<P extends InputProps>(
  WrappedComponent: ComponentType<P>,
) {
  const NumberKeyboardInput = ({
    step = 1,
    value,
    ...props
  }: P & WithNumericIncrementControlsProps) => {
    const { onChange } = props;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    const fractionalLength = -Math.log10(step);
    const formattedValue = formatWithFractional(String(value), fractionalLength);

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

        input.value = Number(newValue.toFixed(fractionalLength)).toString();

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

    return (
      <WrappedComponent
        {...(props as P)}
        role="spinbutton"
        step={step}
        aria-valuenow={formattedValue}
        aria-valuemin={props.min}
        aria-valuemax={props.max}
        value={formattedValue}
        ref={mergeRefs(inputRef, props.ref)}
        labelRef={mergeRefs(labelRef, props.labelRef)}
      />
    );
  };

  return NumberKeyboardInput as ComponentType<P & WithNumericIncrementControlsProps>;
}
