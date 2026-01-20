import { useSubscribe } from "@spred/react";

import { MenuItemLink } from "@core/components/Menu/MenuItemLink";
import { $exportConfigHash } from "@core/stores/config";
import { getShareUrl } from "@core/utils/url/getShareUrl";

export function OpenInWebApp() {
  const configHash = useSubscribe($exportConfigHash);

  return (
    <MenuItemLink value="open-in-web" href={getShareUrl(configHash)} target="_blank">
      Open in web app
    </MenuItemLink>
  );
}
