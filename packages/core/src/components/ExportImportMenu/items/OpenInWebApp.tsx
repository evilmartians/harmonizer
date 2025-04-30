import { useSubscribe } from "@spred/react";

import { MenuItemLink } from "@core/components/Menu/MenuItemLink";
import { HARMONIZER_WEB_APP_URL } from "@core/constants";
import { $compactExportConfigHash } from "@core/stores/config";

export function OpenInWebApp() {
  const configHash = useSubscribe($compactExportConfigHash);

  return (
    <MenuItemLink
      value="open-in-web"
      href={`${HARMONIZER_WEB_APP_URL}/${configHash}`}
      target="_blank"
    >
      Open in web app
    </MenuItemLink>
  );
}
