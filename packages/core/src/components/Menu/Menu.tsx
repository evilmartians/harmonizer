import { List } from "@core/components/List/List";
import * as menu from "@zag-js/menu";
import { normalizeProps, Portal, useMachine } from "@zag-js/react";
import { type HTMLAttributes, type ReactElement, type ReactNode, useId } from "react";

import styles from "./Menu.module.css";
import { MenuContext } from "./MenuContext";

export type MenuProps = {
  renderTrigger: (
    triggerProps: HTMLAttributes<HTMLButtonElement>,
    indicatorProps: Record<`data-${string}`, string>,
  ) => ReactNode;
  children: ReactElement | ReactElement[];
};

export function Menu({ renderTrigger, children }: MenuProps) {
  const service = useMachine(menu.machine, {
    id: useId(),
    positioning: { offset: { mainAxis: 2, crossAxis: 0 } },
  });
  const api = menu.connect(service, normalizeProps);

  return (
    <MenuContext.Provider value={{ api }}>
      {renderTrigger(api.getTriggerProps(), api.getIndicatorProps())}
      <Portal>
        <div {...api.getPositionerProps()} className={styles.dropdown}>
          <List {...api.getContentProps()}>{children}</List>
        </div>
      </Portal>
    </MenuContext.Provider>
  );
}
