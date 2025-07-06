import { HARMONIZER_WEB_APP_URL } from "@core/constants";

export function getShareUrl(configHash: string): string {
  return `${HARMONIZER_WEB_APP_URL}/${configHash}`;
}
