import {
  ListItemSeparator,
  type ListItemSeparatorProps,
} from "@core/components/List/ListItemSeparator";
import { mergeProps } from "@core/utils/react/mergeProps";

import { useMenuApi } from "./MenuContext";

export type MenuItemSeparatorProps = ListItemSeparatorProps;

export function MenuItemSeparator(props: MenuItemSeparatorProps) {
  const api = useMenuApi();

  return <ListItemSeparator {...mergeProps(props, api.getSeparatorProps())} />;
}
