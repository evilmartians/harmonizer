import { type ChangeEvent, useCallback, useRef } from "react";

import { type ButtonProps, Button } from "@/components/Button/Button";
import { mergeProps } from "@/utils/react/mergeProps";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleUpload = useCallback(() => inputRef.current?.click(), []);

  return (
    <>
      <input
        className="sr-only"
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onFilesChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <Button {...mergeProps(restProps, { onClick: handleUpload })} />
    </>
  );
}
