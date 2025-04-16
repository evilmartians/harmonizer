import { createContext, use } from "react";

import type * as menu from "@zag-js/menu";
import type { PropTypes } from "@zag-js/react";

import { invariant } from "@core/utils/assertions/invariant";

export type MenuState = {
  api: menu.Api<PropTypes>;
};

export const MenuContext = createContext<MenuState | null>(null);

export function useMenuApi() {
  const context = use(MenuContext);

  invariant(context !== null, "MenuContext is not provided");

  return context.api;
}
