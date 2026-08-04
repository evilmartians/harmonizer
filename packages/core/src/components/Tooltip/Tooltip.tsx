import { type HTMLAttributes, type ReactNode, type RefCallback, useId, useRef } from "react";

import { normalizeProps, Portal, useMachine } from "@zag-js/react";
import * as tooltip from "@zag-js/tooltip";

import { Text } from "@core/components/Text/Text";

import styles from "./Tooltip.module.css";

export type TooltipTriggerProps = HTMLAttributes<HTMLElement> & { ref: RefCallback<HTMLElement> };

export type TooltipProps = {
  content: ReactNode;
  disabled?: boolean;
  placement?: tooltip.Placement;
  renderTrigger: (triggerProps: TooltipTriggerProps) => ReactNode;
};

const OPEN_DELAY_MS = 200;

export function Tooltip({ content, disabled, placement = "top", renderTrigger }: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const setTriggerRef: RefCallback<HTMLElement> = (element) => {
    triggerRef.current = element;
  };
  const service = useMachine(tooltip.machine, {
    id: useId(),
    disabled,
    openDelay: OPEN_DELAY_MS,
    closeDelay: 0,
    positioning: {
      placement,
      offset: { mainAxis: 4, crossAxis: 0 },
      // A trigger can carry props from another zag machine (a menu item does), which takes over
      // the id and data attributes the tooltip would look itself up by. The ref always works.
      getAnchorRect: () => triggerRef.current?.getBoundingClientRect() ?? null,
    },
  });
  const api = tooltip.connect(service, normalizeProps);

  return (
    <>
      {renderTrigger({ ...api.getTriggerProps(), ref: setTriggerRef })}
      {api.open && (
        <Portal>
          <div {...api.getPositionerProps()}>
            <Text as="div" size="s" {...api.getContentProps()} className={styles.content}>
              {content}
            </Text>
          </div>
        </Portal>
      )}
    </>
  );
}
