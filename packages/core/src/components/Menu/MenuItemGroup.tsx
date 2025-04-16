import type { ComponentProps } from "react";

import { ListItemGroup } from "@core/components/List/ListItemGroup";
import { mergeProps } from "@core/utils/react/mergeProps";

import { useMenuApi } from "./MenuContext";

export type MenuItemGroupProps = ComponentProps<"ul"> & { id: string; label: string };

export function MenuItemGroup({ id, label, ...restProps }: MenuItemGroupProps) {
  const api = useMenuApi();

  return (
    <ListItemGroup
      label={label}
      labelProps={api.getItemGroupLabelProps({ htmlFor: id })}
      {...mergeProps(restProps, api.getItemGroupProps({ id }))}
    />
  );
}
