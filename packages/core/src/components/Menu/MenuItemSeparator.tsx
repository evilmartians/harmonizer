import {
  ListItemSeparator,
  type ListItemSeparatorProps,
} from "@core/components/List/ListItemSeparator";
import { mergeProps } from "@core/utils/react/mergeProps";

import { useMenuApi } from "./MenuContext";

export type MenuItemSeparatorProps = Omit<ListItemSeparatorProps<"div">, "as">;

export function MenuItemSeparator(props: MenuItemSeparatorProps) {
  const api = useMenuApi();

  return <ListItemSeparator as="div" {...mergeProps(props, api.getSeparatorProps())} />;
}
