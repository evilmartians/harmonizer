import Plausible from "plausible-tracker";

import { WEB_APP_DOMAIN } from "@core/constants";

const { trackPageview, trackEvent } = Plausible({ domain: WEB_APP_DOMAIN });

trackPageview();

export { trackEvent };
