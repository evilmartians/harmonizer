import { IconTextButton } from "../Button/IconTextButton";
import arrowUpIcon from "../../assets/icons/ArrowUp.svg";
import arrowDownIcon from "../../assets/icons/ArrowDown.svg";

export function FloatingActions() {
  const handleUpload = () => {
    console.log("Upload clicked");
  };

  const handleDownload = () => {
    console.log("Download clicked");
  };

  return (
    <div className="fixed bottom-6 right-6 flex gap-3">
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
