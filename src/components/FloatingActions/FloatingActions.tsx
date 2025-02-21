import { useRef } from "react";

import arrowDownIcon from "../../assets/icons/ArrowDown.svg";
import arrowUpIcon from "../../assets/icons/ArrowUp.svg";
import { useTableConfigContext } from "../../contexts/TableConfigContext";
import { exportConfigSchema } from "../../schemas/exportConfigSchema";
import { IconTextButton } from "../Button/IconTextButton";

import { safeParse, formatValidationError } from "@/schemas";

export function FloatingActions() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getConfig, updateConfig } = useTableConfigContext();

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = safeParse(exportConfigSchema, JSON.parse(text));

      if (!result.success) {
        // eslint-disable-next-line no-alert
        alert(formatValidationError(result.issues));
        return;
      }

      updateConfig(result.output);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(`Error reading config file: ${String(error)}`);
    } finally {
      // Reset input so the same file can be selected again
      event.target.value = "";
    }
  };

  const handleDownload = () => {
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
  };

  return (
    <div className="fixed bottom-4 right-4 flex gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
      <IconTextButton
        icon={<img src={arrowUpIcon} alt="Upload" />}
        text="Upload"
        onClick={handleUpload}
      />
      <IconTextButton
        icon={<img src={arrowDownIcon} alt="Download" />}
        text="Download"
        onClick={handleDownload}
      />
    </div>
  );
}
