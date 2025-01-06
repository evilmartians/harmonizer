import { IconTextButton } from "../Button/IconTextButton";
import arrowUpIcon from "../../assets/icons/ArrowUp.svg";
import arrowDownIcon from "../../assets/icons/ArrowDown.svg";
import { useTableConfigContext } from "../../contexts/TableConfigContext";
import { useRef } from "react";
import { validateConfig } from "../../utils/configValidation";

export function FloatingActions() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getConfig, updateConfig } = useTableConfigContext();

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const config = validateConfig(text);

      if (!config) {
        alert("Invalid config file format");
        return;
      }
      updateConfig(config);
    } catch (error) {
      alert(`Error reading config file: ${error}`);
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

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
