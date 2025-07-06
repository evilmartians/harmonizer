import { useSubscribe } from "@spred/react";

import { MenuItemLink } from "@core/components/Menu/MenuItemLink";
import { $compactExportConfigHash } from "@core/stores/config";
import { getShareUrl } from "@core/utils/url/getShareUrl";

export function OpenInWebApp() {
  const configHash = useSubscribe($compactExportConfigHash);

  return (
    <MenuItemLink value="open-in-web" href={getShareUrl(configHash)} target="_blank">
      Open in web app
    </MenuItemLink>
  );
}
