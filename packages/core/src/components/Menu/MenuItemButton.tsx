import { ListItem, type ListItemProps } from "@core/components/List/ListItem";
import { ListItemContent } from "@core/components/List/ListItemContent";
import { mergeProps } from "@core/utils/react/mergeProps";

import { useMenuApi } from "./MenuContext";

export type MenuItemProps = Omit<ListItemProps<"button">, "as"> & {
  value: string;
};

export function MenuItemButton({ value, children, ...restProps }: MenuItemProps) {
  const api = useMenuApi();

  return (
    <ListItem as="button" {...mergeProps(api.getItemProps({ value }), restProps)}>
      <ListItemContent>{children}</ListItemContent>
    </ListItem>
  );
}
