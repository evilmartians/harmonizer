import { init, track } from "@plausible-analytics/tracker";
import type { PlausibleEventOptions } from "@plausible-analytics/tracker";

import { WEB_APP_DOMAIN } from "@core/constants";

init({ domain: WEB_APP_DOMAIN });

export function trackEvent(eventName: string, options: PlausibleEventOptions = {}) {
  track(eventName, options);
}
