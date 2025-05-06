import { MenuItemButton } from "@core/components/Menu/MenuItemButton";
import { downloadConfigTarget, ExportTargets } from "@core/stores/config";
import { objectEntries } from "@core/utils/object/objectEntries";

export type ExportConfigsListProps = {
  onClick?: (exportTarget: string) => void;
};

export function ExportConfigsList({ onClick }: ExportConfigsListProps) {
  return objectEntries(ExportTargets).map(([exportTarget, config]) => (
    <MenuItemButton
      key={exportTarget}
      value={exportTarget}
      onClick={() => {
        downloadConfigTarget(exportTarget);
        onClick?.(exportTarget);
      }}
    >
      {config.name}
    </MenuItemButton>
  ));
}
