import type { ChangeEvent } from "react";

import { useFileUploader } from "@core/components/FileInputButton/useFileUploader";
import { ListItem } from "@core/components/List/ListItem";
import { ListItemContent } from "@core/components/List/ListItemContent";
import { useMenuApi } from "@core/components/Menu/MenuContext";
import { uploadConfig } from "@core/stores/config";
import { ValidationError } from "@core/utils/errors/ValidationError";
import { mergeProps } from "@core/utils/react/mergeProps";

export async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
  try {
    await uploadConfig(e.target.files?.[0]);
  } catch (error) {
    // eslint-disable-next-line no-alert
    alert(
      error instanceof ValidationError
        ? "Couldn't parse file. It should be Harmonizer config"
        : String(error),
    );
  } finally {
    e.target.value = "";
  }
}

type UploadConfigProps = {
  onClick?: VoidFunction;
};

export function UploadConfig({ onClick }: UploadConfigProps) {
  const api = useMenuApi();
  const { fileInput, triggerUpload } = useFileUploader({
    accept: ".json",
    onFilesChange: handleFileUpload,
  });
  return (
    <ListItem
      as="button"
      {...mergeProps(
        api.getItemProps({ value: "upload-harmonizer-config" }),
        {
          onClick: triggerUpload,
        },
        { onClick },
      )}
    >
      {fileInput}
      <ListItemContent>Upload Harmonizer config</ListItemContent>
    </ListItem>
  );
}
