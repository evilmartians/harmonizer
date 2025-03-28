import { mergeRefs } from "@core/utils/react/mergeRefs";
import { type ChangeEvent, type ComponentType, useCallback, useEffect, useRef } from "react";

import type { InputProps } from "../Input";

type WithNumericIncrementControlsProps = {
  incrementStep?: number;
};

function formatWithFractional(value: string, fractionalLength: number): string {
  const number = Number(value);
  return Number.isNaN(number) || fractionalLength === 0 ? value : number.toFixed(fractionalLength);
}

export function withNumericIncrementControls<P extends InputProps>(
  WrappedComponent: ComponentType<P>,
) {
  const NumberKeyboardInput = ({
    incrementStep = 1,
    value,
    ...props
  }: P & WithNumericIncrementControlsProps) => {
    const { onChange } = props;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const labelRef = useRef<HTMLLabelElement>(null);
    const fractionalLength = -Math.log10(incrementStep);

    const updateValue = useCallback(
      (input: HTMLInputElement, increment: number) => {
        const currentValue = Number.parseFloat(input.value);

        if (Number.isNaN(currentValue)) {
          return;
        }

        input.value = Number((currentValue + increment).toFixed(fractionalLength)).toString();

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
        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

        const increment = e.shiftKey ? incrementStep * 10 : incrementStep;
        const direction = e.key === "ArrowUp" ? 1 : -1;

        e.preventDefault();
        updateValue(input, increment * direction);
      };

      input.addEventListener("keydown", handleKeyDown);

      return () => input.removeEventListener("keydown", handleKeyDown);
    }, [incrementStep, updateValue]);

    useEffect(() => {
      const label = labelRef.current;
      const input = inputRef.current;

      if (!label || !input) return;

      const handleWheel = (e: WheelEvent) => {
        if (document.activeElement !== input || !label.matches(":hover")) return;

        const increment = e.shiftKey ? incrementStep * 10 : incrementStep;
        const direction = e[e.shiftKey ? "deltaX" : "deltaY"] < 0 ? 1 : -1;

        e.preventDefault();
        updateValue(input, increment * direction);
      };

      label.addEventListener("wheel", handleWheel);

      return () => label.removeEventListener("wheel", handleWheel);
    }, [incrementStep, updateValue]);

    return (
      <WrappedComponent
        {...(props as P)}
        value={formatWithFractional(String(value), fractionalLength)}
        ref={mergeRefs(inputRef, props.ref)}
        labelRef={mergeRefs(labelRef, props.labelRef)}
      />
    );
  };

  return NumberKeyboardInput as ComponentType<P & WithNumericIncrementControlsProps>;
}
