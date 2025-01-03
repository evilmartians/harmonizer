import { IconTextButton } from "../Button/IconTextButton";
import arrowUpIcon from "../../assets/icons/ArrowUp.svg";
import arrowDownIcon from "../../assets/icons/ArrowDown.svg";
import { useTableConfigContext } from "../../contexts/TableConfigContext";

export function FloatingActions() {
  const { getConfig } = useTableConfigContext();

  const handleUpload = () => {
    console.log("Upload clicked");
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
