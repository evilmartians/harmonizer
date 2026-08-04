import { useSubscribe } from "@spred/react";

import { MenuItemLink } from "@core/components/Menu/MenuItemLink";
import { Tooltip } from "@core/components/Tooltip/Tooltip";
import { $exportConfigHash, $isExportConfigValid } from "@core/stores/config";
import { getShareUrl } from "@core/utils/url/getShareUrl";

export function OpenInWebApp() {
  const configHash = useSubscribe($exportConfigHash);
  const isValid = useSubscribe($isExportConfigValid);

  return (
    <Tooltip
      content="Fix invalid values to open the palette in the web app"
      disabled={isValid}
      placement="left"
      renderTrigger={(triggerProps) => (
        <MenuItemLink
          {...triggerProps}
          value="open-in-web"
          href={getShareUrl(configHash)}
          target="_blank"
          disabled={!isValid}
        >
          Open in web app
        </MenuItemLink>
      )}
    />
  );
}
