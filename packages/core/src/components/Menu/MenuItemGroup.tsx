import type { ComponentProps } from "react";

import { List } from "@core/components/List/List";
import { ListItemGroupLabel } from "@core/components/List/ListItemGroupLabel";
import { mergeProps } from "@core/utils/react/mergeProps";

import { useMenuApi } from "./MenuContext";

export type MenuItemGroupProps = ComponentProps<"div"> & { id: string; label: string };

export function MenuItemGroup({ id, label, children, ...restProps }: MenuItemGroupProps) {
  const api = useMenuApi();

  return (
    <div>
      <ListItemGroupLabel {...api.getItemGroupLabelProps({ htmlFor: id })}>
        {label}
      </ListItemGroupLabel>
      <List as="div" {...mergeProps(restProps, api.getItemGroupProps({ id }))}>
        {children}
      </List>
    </div>
  );
}
