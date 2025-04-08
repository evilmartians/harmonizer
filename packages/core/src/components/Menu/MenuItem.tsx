import { ListItem, type ListItemProps } from "@core/components/List/ListItem";
import { mergeProps } from "@core/utils/react/mergeProps";

import { useMenuApi } from "./MenuContext";

export type MenuItemProps = ListItemProps & {
  value: string;
};

export function MenuItem({ value, ...restProps }: MenuItemProps) {
  const api = useMenuApi();

  return <ListItem {...mergeProps(restProps, api.getItemProps({ value }))} />;
}
