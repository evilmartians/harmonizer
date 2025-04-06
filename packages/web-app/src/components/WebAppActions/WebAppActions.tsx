import { Button } from "@core/components/Button/Button";
import { FileInputButton } from "@core/components/FileInputButton/FileInputButton";
import { MArrowDownwards } from "@core/components/Icon/MArrowDownwards";
import { parseExportConfig } from "@core/schemas/exportConfig";
import { $isExportConfigValid, getConfig, updateConfig } from "@core/stores/config";
import { useSubscribe } from "@spred/react";
import type { ChangeEvent } from "react";

import styles from "./WebAppActions.module.css";

async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    updateConfig(parseExportConfig(text));
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(`Error reading config file: ${String(error)}`);
  } finally {
    // Reset input so the same file can be selected again
    e.target.value = "";
  }
}

function handleDownload() {
  const config = JSON.stringify(getConfig(), null, 2);
  const blob = new Blob([config], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "My Harmony config.json";
  document.body.append(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
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
        onClick={handleDownload}
        iconStart={<MArrowDownwards />}
        disabled={!isValid}
      >
        Download
      </Button>
    </>
  );
}
