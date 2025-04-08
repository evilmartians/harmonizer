import { type ChangeEvent, memo, type RefObject, useCallback, useRef } from "react";

export type FileUploaderOptions = {
  accept?: string;
  multiple?: true;
  onFilesChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

type HiddenFileInputProps = FileUploaderOptions & { ref: RefObject<HTMLInputElement | null> };

const HiddenFileInput = memo(function HiddenFileInput({
  accept,
  multiple,
  onFilesChange,
  ref,
}: HiddenFileInputProps) {
  return (
    <input
      ref={ref}
      accept={accept}
      multiple={multiple}
      onChange={onFilesChange}
      className="sr-only"
      type="file"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
});

export function useFileUploader(fileInputProps: FileUploaderOptions) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const triggerUpload = useCallback(() => inputRef.current?.click(), []);

  return {
    triggerUpload,
    fileInput: <HiddenFileInput ref={inputRef} {...fileInputProps} />,
  };
}
