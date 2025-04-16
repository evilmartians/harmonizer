import { useSubscribe } from "@spred/react";
import { pluginChannel } from "@ui/pluginChannel";

import { Button } from "@core/components/Button/Button";
import { MFourSquares } from "@core/components/Icon/MFourSquares";
import { $isExportConfigValid, getExportConfigWithColors } from "@core/stores/config";

function upsertPalette() {
  pluginChannel.emit("palette:generate", getExportConfigWithColors());
}

export type FigmaPluginActionsProps = { hasPalette: boolean };

export function FigmaPluginActions({ hasPalette }: FigmaPluginActionsProps) {
  const isValid = useSubscribe($isExportConfigValid);

  return (
    <>
      <Button
        kind="floating"
        size="m"
        onClick={upsertPalette}
        iconStart={<MFourSquares />}
        disabled={!isValid}
      >
        {hasPalette ? "Update palette" : "Create palette"}
      </Button>
    </>
  );
}
