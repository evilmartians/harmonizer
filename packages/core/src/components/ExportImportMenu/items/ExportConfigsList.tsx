import { useSubscribe } from "@spred/react";

import { MenuItemButton } from "@core/components/Menu/MenuItemButton";
import { Tooltip } from "@core/components/Tooltip/Tooltip";
import { $isExportConfigValid, downloadConfigTarget, ExportTargets } from "@core/stores/config";
import { objectEntries } from "@core/utils/object/objectEntries";

export type ExportConfigsListProps = {
  onClick?: (exportTarget: string) => void;
};

export function ExportConfigsList({ onClick }: ExportConfigsListProps) {
  const isValid = useSubscribe($isExportConfigValid);

  return objectEntries(ExportTargets).map(([exportTarget, config]) => (
    <Tooltip
      key={exportTarget}
      content="Fix invalid values to export"
      disabled={isValid}
      placement="left"
      renderTrigger={(triggerProps) => (
        <MenuItemButton
          {...triggerProps}
          value={exportTarget}
          disabled={!isValid}
          onClick={() => {
            downloadConfigTarget(exportTarget);
            onClick?.(exportTarget);
          }}
        >
          {config.name}
        </MenuItemButton>
      )}
    />
  ));
}
