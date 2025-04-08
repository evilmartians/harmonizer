import { type ButtonProps, Button } from "@core/components/Button/Button";
import { mergeProps } from "@core/utils/react/mergeProps";
import type { ChangeEvent } from "react";

import { useFileUploader } from "./useFileUploader";

export type FileInputButtonProps = ButtonProps & {
  accept?: string;
  multiple?: true;
  onFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function FileInputButton({
  accept,
  multiple,
  onFilesChange,
  ...restProps
}: FileInputButtonProps) {
  const { fileInput, triggerUpload } = useFileUploader({ accept, multiple, onFilesChange });

  return (
    <>
      {fileInput}
      <Button {...mergeProps(restProps, { onClick: triggerUpload })} />
    </>
  );
}
