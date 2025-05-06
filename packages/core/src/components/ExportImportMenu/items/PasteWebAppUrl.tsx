import {
  type ChangeEvent,
  useCallback,
  useRef,
  useState,
  type ClipboardEvent,
  type MouseEvent,
} from "react";

import clsx from "clsx";

import { ListItem, type ListItemProps } from "@core/components/List/ListItem";
import { ListItemContent } from "@core/components/List/ListItemContent";
import { useMenuApi } from "@core/components/Menu/MenuContext";
import { parseConfigFromHashAndUpdate } from "@core/stores/config";
import { mergeProps } from "@core/utils/react/mergeProps";

import styles from "./PasteWebAppUrl.module.css";

export type ActionPasteUrlProps = Omit<ListItemProps<"button">, "as"> & {
  value: string;
  onPaste?: (data: string) => void;
};

export function PasteWebAppUrl({ value, onPaste, ...restProps }: ActionPasteUrlProps) {
  const api = useMenuApi();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPasting, setIsPasting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const goIntoPasteMode = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsPasting(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);
  const { onClick: _, ...restItemProps } = api.getItemProps({ value });
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (!isPasting) {
        return;
      }

      e.preventDefault();

      const pastedData = e.clipboardData.getData("text/plain");
      const hashValue = pastedData.split("#")[1];
      const updated = hashValue ? parseConfigFromHashAndUpdate(hashValue) : false;

      setHasError(!updated);
      if (updated) {
        api.setOpen(false);
        onPaste?.(pastedData);
      }
    },
    [isPasting],
  );
  const handleChange = useCallback((e: ChangeEvent) => e.preventDefault(), []);

  return (
    <ListItem
      as={isPasting ? "div" : "button"}
      {...mergeProps(
        {
          onClick: goIntoPasteMode,
          className: styles.item,
        },
        restItemProps,
        restProps,
      )}
      highlighted={isPasting}
    >
      {isPasting && (
        <ListItemContent
          as="input"
          ref={inputRef}
          className={clsx(styles.input, hasError && styles.hasError)}
          placeholder="Paste url..."
          onPaste={handlePaste}
          value=""
          onChange={handleChange}
        />
      )}
      {!isPasting && <ListItemContent>Paste web app link</ListItemContent>}
    </ListItem>
  );
}
