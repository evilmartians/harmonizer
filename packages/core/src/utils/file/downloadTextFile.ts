export type DownloadTextFileData = { filename: string; mimetype: string; data: string };

export function downloadTextFile({ filename, mimetype, data }: DownloadTextFileData) {
  const blob = new Blob([data], { type: mimetype });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
