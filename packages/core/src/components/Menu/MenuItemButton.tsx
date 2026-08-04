import { ListItem, type ListItemProps } from "@core/components/List/ListItem";
import { ListItemContent } from "@core/components/List/ListItemContent";
import { mergeProps } from "@core/utils/react/mergeProps";

import { useMenuApi } from "./MenuContext";

export type MenuItemProps = Omit<ListItemProps<"button">, "as"> & {
  value: string;
};

// A disabled item keeps its DOM events so a tooltip can still explain why it is blocked.
// Keyboard navigation skips it anyway: the menu only walks items without [data-disabled].
// Own props come first in the merge so the menu keeps control of the item id.
export function MenuItemButton({
  value,
  disabled,
  onClick,
  children,
  ...restProps
}: MenuItemProps) {
  const api = useMenuApi();

  return (
    <ListItem
      as="button"
      {...mergeProps(restProps, api.getItemProps({ value, disabled }), {
        onClick: disabled ? undefined : onClick,
      })}
    >
      <ListItemContent>{children}</ListItemContent>
    </ListItem>
  );
}
