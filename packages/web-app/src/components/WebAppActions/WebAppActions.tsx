import { Button } from "@core/components/Button/Button";
import { FileInputButton } from "@core/components/FileInputButton/FileInputButton";
import { MArrowDownwards } from "@core/components/Icon/MArrowDownwards";
import { $isExportConfigValid, downloadConfig, uploadConfig } from "@core/stores/config";
import { useSubscribe } from "@spred/react";
import type { ChangeEvent } from "react";

import styles from "./WebAppActions.module.css";

async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
  try {
    await uploadConfig(e.target.files?.[0]);
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(`Error reading config file: ${String(error)}`);
  } finally {
    e.target.value = "";
  }
}

export function WebAppActions() {
  const isValid = useSubscribe($isExportConfigValid);

  return (
    <>
      <FileInputButton
        kind="floating"
        size="s"
        onFilesChange={handleFileUpload}
        iconStart={<MArrowDownwards className={styles.iconUpload} />}
      >
        Upload
      </FileInputButton>
      <Button
        kind="floating"
        size="s"
        onClick={downloadConfig}
        iconStart={<MArrowDownwards />}
        disabled={!isValid}
      >
        Download
      </Button>
    </>
  );
}
