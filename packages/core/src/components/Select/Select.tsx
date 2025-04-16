import { type ComponentProps, useId } from "react";

import { normalizeProps, Portal, useMachine } from "@zag-js/react";
import * as select from "@zag-js/select";
import clsx from "clsx";

import { Button, type ButtonKind, type ButtonSize } from "@core/components/Button/Button";
import { MCheck } from "@core/components/Icon/MCheck";
import { MTriangleDown } from "@core/components/Icon/MTriangleDown";
import { List } from "@core/components/List/List";
import { ListItem } from "@core/components/List/ListItem";
import { mergeProps } from "@core/utils/react/mergeProps";

import styles from "./Select.module.css";

export type SelectProps = Omit<ComponentProps<"select">, "size" | "value" | "multiple"> & {
  size: ButtonSize;
  kind?: ButtonKind;
  placeholder?: string;
  options: { value: string; label: string }[];
} & ({ multiple: true; value: string[] } | { multiple?: false; value: string });

export function Select({
  className,
  kind = "primary",
  size,
  value,
  multiple,
  options,
  placeholder = "Select an option",
  onChange,
}: SelectProps) {
  const collection = select.collection({
    items: options,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  });
  const service = useMachine(select.machine, {
    id: useId(),
    collection,
    multiple,
    defaultValue: multiple ? value : [value],
    positioning: { offset: { mainAxis: 2, crossAxis: 0 } },
  });
  const api = select.connect(service, normalizeProps);

  return (
    <div {...mergeProps(api.getRootProps(), { className: clsx(styles.container, className) })}>
      <select {...mergeProps(api.getHiddenSelectProps(), { onChange })}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div {...api.getControlProps()}>
        <Button {...mergeProps(api.getTriggerProps(), { size, kind, className: styles.button })}>
          {api.valueAsString || placeholder}
          <MTriangleDown className={clsx(styles.icon, styles[`size_${size}`])} />
        </Button>
      </div>

      <Portal>
        <div {...api.getPositionerProps()}>
          <List {...mergeProps(api.getContentProps(), { className: styles.dropdown })}>
            {options.map((item) => (
              <ListItem
                {...mergeProps(api.getItemProps({ item }), {
                  className: styles.item,
                })}
                key={item.value}
              >
                {item.label}
                <span {...api.getItemIndicatorProps({ item })}>
                  <MCheck className={styles.checkIcon} />
                </span>
              </ListItem>
            ))}
          </List>
        </div>
      </Portal>
    </div>
  );
}
