import { ListItem, type ListItemProps } from "@core/components/List/ListItem";
import { ListItemContent } from "@core/components/List/ListItemContent";
import { mergeProps } from "@core/utils/react/mergeProps";

import { useMenuApi } from "./MenuContext";

export type MenuItemProps = Omit<ListItemProps<"a">, "as"> & {
  value: string;
  disabled?: boolean;
};

export function MenuItemLink({ value, disabled, href, children, ...restProps }: MenuItemProps) {
  const api = useMenuApi();

  return (
    <ListItem
      as="a"
      href={disabled ? undefined : href}
      {...mergeProps(restProps, api.getItemProps({ value, disabled }))}
    >
      <ListItemContent>{children}</ListItemContent>
    </ListItem>
  );
}
