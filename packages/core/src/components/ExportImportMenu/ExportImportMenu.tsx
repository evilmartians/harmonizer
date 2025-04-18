import type { ReactElement } from "react";

import { Button } from "@core/components/Button/Button";
import { MArrowDownwards } from "@core/components/Icon/MArrowDownwards";
import { Menu } from "@core/components/Menu/Menu";

export type ExportImportMenuProps = {
  children: ReactElement | ReactElement[];
};

export function ExportImportMenu({ children }: ExportImportMenuProps) {
  return (
    <Menu
      renderTrigger={(triggerProps, indicatorProps) => (
        <Button
          size="m"
          kind="floating"
          {...triggerProps}
          {...indicatorProps}
          icon={<MArrowDownwards {...indicatorProps} />}
          aria-label="Download or upload configurations"
        />
      )}
    >
      {children}
    </Menu>
  );
}
